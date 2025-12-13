import { NextRequest, NextResponse } from 'next/server';

import { getUserOrThrow } from '@/lib/auth/getUser';
import { createCommunityReply } from '@/lib/services/server/community.service';
import { communityErrorResponse } from '../helpers';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const payload = await request.json();
    const postId = payload?.postId;
    const content = typeof payload?.content === 'string' ? payload.content : '';

    if (!postId) {
      throw new Error('Post id is required');
    }

    const reply = await createCommunityReply({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      postId,
      content,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    return communityErrorResponse(error);
  }
}
