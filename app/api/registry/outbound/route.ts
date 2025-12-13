import { NextRequest, NextResponse } from 'next/server';

import { resolveRegistryOutboundLink } from '@/lib/services/server/registry.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const itemId = request.nextUrl.searchParams.get('itemId');
    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
    }

    const href = await resolveRegistryOutboundLink(user.id, itemId);
    const destination = href.startsWith('http') ? new URL(href) : new URL(href, request.url);
    return NextResponse.redirect(destination);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to redirect to affiliate partner';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
