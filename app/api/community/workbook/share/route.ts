import { NextRequest, NextResponse } from 'next/server';

import type { WorkbookSection } from '@prisma/client';
import { getUserOrThrow } from '@/lib/auth/getUser';
import { shareWorkbookReflection } from '@/lib/services/server/community.service';
import { communityErrorResponse } from '../../helpers';

type Payload = {
  moduleId?: string;
  promptTitle?: string;
  response?: string;
  section?: string;
  anonymous?: boolean;
  workbookEntryId?: string;
};

const normalizeSection = (value?: string): WorkbookSection => {
  const normalized = value?.toLowerCase();
  if (normalized === 'apply') return 'APPLY';
  if (normalized === 'integrate') return 'INTEGRATE';
  return 'REFLECT';
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const payload = (await request.json()) as Payload;
    if (!payload.moduleId || !payload.promptTitle || !payload.response?.trim()) {
      throw new Error('Module, prompt title, and reflection are required.');
    }

    const reflection = await shareWorkbookReflection({
      user: { id: user.id, name: user.name, role: user.role },
      moduleId: payload.moduleId,
      promptTitle: payload.promptTitle,
      response: payload.response,
      section: normalizeSection(payload.section) as any,
      anonymous: Boolean(payload.anonymous),
      workbookEntryId: payload.workbookEntryId,
    });

    return NextResponse.json({ post: reflection });
  } catch (error) {
    return communityErrorResponse(error);
  }
}
