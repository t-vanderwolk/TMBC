"use server";

import { redirect } from 'next/navigation';
import { getUserOrThrow } from '@/lib/auth/getUser';
import {
  saveIntakeStep as persistIntake,
} from '@/lib/services/onboarding.service';
import {
  addCustomItem,
  removeRegistryItem as discardRegistryItem,
  updateRegistryItem as patchRegistryItem,
  syncMemberRegistry,
} from '@/lib/services/server/registry.service';
import {
  createCapsule as persistCapsule,
  updateCapsule as patchCapsule,
} from '@/lib/services/timecapsule.service';
import { rsvpEvent as confirmRsvp } from '@/lib/services/events.service';
import { sendMessage as sendThreadMessage } from '@/lib/services/messages.service';
import { RegistrySection } from '@prisma/client';

const toRecord = (formData: FormData) => {
  const payload: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (!value) return;
    payload[key] = value.toString();
  });
  return payload;
};

const resolveSection = (category?: string | null): RegistrySection => {
  const normalized = category?.toLowerCase() ?? '';
  if (normalized.includes('nursery')) return RegistrySection.NURSERY;
  if (normalized.includes('feed') || normalized.includes('bottle')) return RegistrySection.FEEDING;
  if (normalized.includes('postpartum') || normalized.includes('wellness')) return RegistrySection.POSTPARTUM;
  if (normalized.includes('later')) return RegistrySection.LATER;
  return RegistrySection.GEAR;
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
  return addCustomItem({
    userId: user.id,
    title: item.title,
    url: item.affiliateUrl ?? 'https://taylor-madebaby.com',
    merchant: item.category,
    category: item.category,
    section: resolveSection(item.category),
    price: item.price,
    image: item.image,
  });
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
  return patchRegistryItem({
    userId: user.id,
    itemId,
    notes: fields.reasoning ?? undefined,
    purchaseSource: fields.purchaseSource ?? undefined,
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
  return syncMemberRegistry(user.id);
}
