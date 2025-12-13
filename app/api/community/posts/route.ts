import { NextRequest, NextResponse } from 'next/server';

import { getUserOrThrow } from '@/lib/auth/getUser';
import { createCommunityPost } from '@/lib/services/server/community.service';
import { communityErrorResponse } from '../helpers';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const payload = await request.json();
    const roomId = payload?.roomId;
    const content = typeof payload?.content === 'string' ? payload.content : '';

    if (!roomId) {
      throw new Error('Room id is required');
    }

    const post = await createCommunityPost({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      roomId,
      content,
      isAnnouncement: Boolean(payload?.isAnnouncement),
      isPinned: Boolean(payload?.isPinned),
    });

    return NextResponse.json({ post });
  } catch (error) {
    return communityErrorResponse(error);
  }
}
