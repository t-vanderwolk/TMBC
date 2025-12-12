import { NextRequest, NextResponse } from 'next/server';

import { AuthService } from '@/lib/services/server/auth.service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { email, password } = payload || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    const result = await AuthService.loginUser(String(email), String(password));
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to log in.';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
