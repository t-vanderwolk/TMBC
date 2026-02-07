import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { completeOnboarding } from '@/lib/services/server/onboarding.service';
import { BLOG_IMPACT_SLUG, BLOG_SESSION_COOKIE } from '@/lib/constants/blogAnalytics';
import { recordBlogInfluenceAction } from '@/lib/services/server/blogInfluence.service';
import { BlogInfluenceActionType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { userId } = payload ?? {};

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const user = await completeOnboarding(String(userId));
    const sessionId = cookies().get(BLOG_SESSION_COOKIE)?.value ?? null;
    void recordBlogInfluenceAction({
      slug: BLOG_IMPACT_SLUG,
      action: BlogInfluenceActionType.ONBOARDING_COMPLETE,
      referenceId: user.id,
      sessionId,
      userId: user.id,
    });
    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to mark onboarding complete.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
