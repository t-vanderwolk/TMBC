import { NextRequest, NextResponse } from 'next/server';

import { getUserOrThrow } from '@/lib/auth/getUser';
import { getCommunityRooms } from '@/lib/services/server/community.service';
import { communityErrorResponse } from '../helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const rooms = await getCommunityRooms(user.role);
    return NextResponse.json({ rooms });
  } catch (error) {
    return communityErrorResponse(error);
  }
}
