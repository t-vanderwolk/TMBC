import { NextRequest, NextResponse } from 'next/server';
import { JournalEntryType } from '@prisma/client';

import { getUserOrThrow } from '@/lib/auth/getUser';
import { createJournalEntry, listJournalEntries } from '@/lib/services/server/journal.service';

const JOURNAL_ENTRY_TYPES = new Set(Object.values(JournalEntryType));
const SOURCE_LABELS = ['Mentor', 'Academy'] as const;

const normalizeTags = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  const tags = value
    .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
    .filter((tag) => tag.length > 0);
  return Array.from(new Set(tags));
};

const normalizeSourceLabel = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return SOURCE_LABELS.includes(normalized as (typeof SOURCE_LABELS)[number]) ? normalized : null;
};

const reply = (body: Record<string, unknown>, status: number) => NextResponse.json(body, { status });

export async function GET(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const entries = await listJournalEntries(user.id);
    return reply({ entries }, 200);
  } catch (error) {
    console.error('GET /journal failed', error);
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return reply({ entries: [], error: 'Unable to load your journal.' }, status);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const payload = await request.json();
    const type = (typeof payload?.type === 'string' ? payload.type : '').toUpperCase();
    if (!JOURNAL_ENTRY_TYPES.has(type as JournalEntryType)) {
      return reply({ error: 'Invalid journal type.' }, 400);
    }

    const content = typeof payload?.content === 'string' ? payload.content.trim() : '';
    if (!content) {
      return reply({ error: 'Content is required.' }, 400);
    }

    const entry = await createJournalEntry({
      userId: user.id,
      type: type as JournalEntryType,
      title: typeof payload?.title === 'string' ? payload.title.trim() : null,
      content,
      emotionTags: normalizeTags(payload?.emotionTags),
      sourceLabel: normalizeSourceLabel(payload?.sourceLabel),
      isPrivate: payload?.isPrivate !== undefined ? Boolean(payload?.isPrivate) : true,
    });

    return reply({ entry }, 201);
  } catch (error) {
    console.error('POST /journal failed', error);
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return reply({ error: 'Unable to save your reflection.' }, status);
  }
}
