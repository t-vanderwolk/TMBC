import { NextResponse } from 'next/server';

import { getMemberRegistryState } from '@/lib/services/server/registry.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unable to fetch registry';
  return NextResponse.json({ error: message }, { status: 400 });
};

export async function GET() {
  try {
    const user = await getUserOrThrow();
    const registry = await getMemberRegistryState(user.id);
    return NextResponse.json({ registry });
  } catch (error) {
    return handleError(error);
  }
}
