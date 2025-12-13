"use server";

import { redirect } from 'next/navigation';
import { getUserOrThrow } from '@/lib/auth/getUser';
import { buildCuratedRegistry } from '@/lib/registry/recommendations';
import {
  saveIntakeStep as persistIntake,
} from '@/lib/services/onboarding.service';
import {
  addRegistryItem as persistRegistryItem,
  removeRegistryItem as discardRegistryItem,
  updateRegistryItem as patchRegistryItem,
  syncWithMyRegistry,
} from '@/lib/services/registry.service';
import {
  createCapsule as persistCapsule,
  updateCapsule as patchCapsule,
} from '@/lib/services/timecapsule.service';
import { rsvpEvent as confirmRsvp } from '@/lib/services/events.service';
import { sendMessage as sendThreadMessage } from '@/lib/services/messages.service';

const toRecord = (formData: FormData) => {
  const payload: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (!value) return;
    payload[key] = value.toString();
  });
  return payload;
};

export async function saveOnboardingStep(formData: FormData) {
  const user = await getUserOrThrow();
  const step = formData.get('step')?.toString() ?? 'step';
  const payload = toRecord(formData);
  const tags = await persistIntake(user.id, { step, responses: payload });
  const nextStep = formData.get('nextStep')?.toString();
  if (nextStep) {
    redirect(nextStep);
  }
  return { tags };
}

export async function generateCuratedRegistry(formData: FormData) {
  const tagPayload = formData.get('tags')?.toString() ?? '[]';
  const tags = JSON.parse(tagPayload);
  return buildCuratedRegistry(tags);
}

export async function addRegistryItem(formData: FormData) {
  const user = await getUserOrThrow();
  const item = {
    category: formData.get('category')?.toString() ?? 'general',
    title: formData.get('title')?.toString() ?? 'Taylor-Made pick',
    image: formData.get('image')?.toString(),
    affiliateUrl: formData.get('affiliateUrl')?.toString(),
    price: formData.get('price') ? parseFloat(formData.get('price')?.toString() ?? '0') : undefined,
    reasoning: formData.get('reasoning')?.toString(),
    mentorNotes: formData.get('mentorNotes')?.toString(),
  };
  return persistRegistryItem(user.id, item);
}

export async function removeRegistryItem(formData: FormData) {
  const user = await getUserOrThrow();
  const itemId = formData.get('itemId')?.toString() ?? '';
  return discardRegistryItem(user.id, itemId);
}

export async function updateRegistryItem(formData: FormData) {
  const user = await getUserOrThrow();
  const itemId = formData.get('itemId')?.toString() ?? '';
  const fields = toRecord(formData);
  return patchRegistryItem(user.id, itemId, {
    category: fields.category,
    title: fields.title,
    image: fields.image,
    affiliateUrl: fields.affiliateUrl,
    price: fields.price ? Number(fields.price) : undefined,
    reasoning: fields.reasoning,
    mentorNotes: fields.mentorNotes,
  });
}

export async function createCapsule(formData: FormData) {
  const user = await getUserOrThrow();
  return persistCapsule(user.id, {
    type: formData.get('type')?.toString() ?? 'letter',
    content: { body: formData.get('content')?.toString() ?? '' },
    scheduledFor: formData.get('scheduledFor')?.toString(),
    isPrivate: formData.get('isPrivate') !== 'false',
  });
}

export async function updateCapsule(formData: FormData) {
  const user = await getUserOrThrow();
  return patchCapsule(user.id, Number(formData.get('capsuleId')), {
    type: formData.get('type')?.toString() ?? 'letter',
    content: { body: formData.get('content')?.toString() ?? '' },
    scheduledFor: formData.get('scheduledFor')?.toString(),
    isPrivate: formData.get('isPrivate') !== 'false',
  });
}

export async function rsvpEvent(formData: FormData) {
  const user = await getUserOrThrow();
  const status = (formData.get('status')?.toString() ?? 'going') as 'going' | 'maybe' | 'not going';
  const eventId = formData.get('eventId')?.toString() ?? '';
  return confirmRsvp(user.id, eventId, status);
}

export async function sendMessage(formData: FormData) {
  const user = await getUserOrThrow();
  const threadId = Number(formData.get('threadId'));
  const content = formData.get('content')?.toString() ?? '';
  return sendThreadMessage(user.id, threadId, content);
}

export async function syncWithRegistry() {
  const user = await getUserOrThrow();
  return syncWithMyRegistry(user.id);
}
