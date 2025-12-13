import { NextResponse } from 'next/server';

import { createMemberRegistry } from '@/lib/services/server/registry.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function POST() {
  try {
    const user = await getUserOrThrow();
    const registry = await createMemberRegistry(user.id);
    return NextResponse.json({ registry });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create registry';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
