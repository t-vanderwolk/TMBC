import { NextRequest, NextResponse } from 'next/server';

import { getUserOrThrow } from '@/lib/auth/getUser';
import { getCommunityRoom } from '@/lib/services/server/community.service';
import { communityErrorResponse } from '../../helpers';

type Params = {
  params: {
    roomId: string;
  };
};

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await getUserOrThrow(_request);
    const room = await getCommunityRoom(user.role, params.roomId);
    return NextResponse.json({ room });
  } catch (error) {
    return communityErrorResponse(error);
  }
}
