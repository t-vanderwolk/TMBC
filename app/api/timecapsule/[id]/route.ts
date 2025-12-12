import { NextRequest, NextResponse } from 'next/server';
import { getCapsule, updateCapsule, deleteCapsule } from '@/lib/services/timecapsule.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserOrThrow(request);
  const capsule = await getCapsule(user.id, Number(params.id));
  return NextResponse.json({ capsule });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  const capsule = await updateCapsule(user.id, Number(params.id), payload);
  return NextResponse.json({ capsule });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserOrThrow(request);
  await deleteCapsule(user.id, Number(params.id));
  return NextResponse.json({ success: true });
}
