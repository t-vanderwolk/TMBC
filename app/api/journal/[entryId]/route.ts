import { NextRequest, NextResponse } from 'next/server';

import { getUserOrThrow } from '@/lib/auth/getUser';
import {
  deleteJournalEntry,
  type UpdateJournalEntryInput,
  updateJournalEntry,
} from '@/lib/services/server/journal.service';

const SOURCE_LABELS = ['Mentor', 'Academy'] as const;

const normalizeTags = (value: unknown) => {
  if (!Array.isArray(value)) return undefined;
  const tags = value
    .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
    .filter((tag) => tag.length > 0);
  return Array.from(new Set(tags));
};

const normalizeSourceLabel = (value: unknown) => {
  if (value === null) return null;
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return SOURCE_LABELS.includes(normalized as (typeof SOURCE_LABELS)[number]) ? normalized : undefined;
};

const reply = (body: Record<string, unknown>, status: number) => NextResponse.json(body, { status });

export async function PATCH(
  request: NextRequest,
  { params }: { params: { entryId: string } },
) {
  try {
    const user = await getUserOrThrow(request);
    const payload = (await request.json()) as Record<string, unknown>;
    const data: UpdateJournalEntryInput = {};

    if (payload.hasOwnProperty('title')) {
      const value = payload.title;
      if (value === null) {
        data.title = null;
      } else if (typeof value === 'string') {
        data.title = value.trim();
      }
    }

    if (payload.hasOwnProperty('content')) {
      const value = payload.content;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
          data.content = trimmed;
        }
      }
    }

    if (payload.hasOwnProperty('emotionTags')) {
      const normalized = normalizeTags(payload.emotionTags);
      if (normalized !== undefined) {
        data.emotionTags = normalized;
      }
    }

    if (payload.hasOwnProperty('sourceLabel')) {
      const normalized = normalizeSourceLabel(payload.sourceLabel);
      if (normalized !== undefined) {
        data.sourceLabel = normalized;
      }
    }

    if (payload.hasOwnProperty('isPrivate')) {
      data.isPrivate = Boolean(payload.isPrivate);
    }

    const entry = await updateJournalEntry(params.entryId, user.id, data);
    return reply({ entry }, 200);
  } catch (error) {
    console.error('PATCH /journal/:entryId failed', error);
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 404;
    return reply({ error: 'Unable to update this entry.' }, status);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { entryId: string } },
) {
  try {
    const user = await getUserOrThrow(request);
    await deleteJournalEntry(params.entryId, user.id);
    return reply({ ok: true }, 200);
  } catch (error) {
    console.error('DELETE /journal/:entryId failed', error);
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 404;
    return reply({ error: 'Unable to delete this entry.' }, status);
  }
}
