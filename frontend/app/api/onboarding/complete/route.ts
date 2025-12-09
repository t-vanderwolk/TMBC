import { NextRequest } from 'next/server';

import { proxyOnboardingPost } from '../_proxy';

export async function POST(req: NextRequest) {
  return proxyOnboardingPost(req, '/complete');
}
