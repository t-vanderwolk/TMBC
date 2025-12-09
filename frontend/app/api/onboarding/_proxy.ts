import { NextRequest, NextResponse } from 'next/server';

const getBackendUrl = (): string | null => {
  return process.env.NEXT_PUBLIC_API_URL ?? null;
};

export const proxyOnboardingPost = async (req: NextRequest, endpoint: string) => {
  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_API_URL is not configured' },
      { status: 500 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    payload = undefined;
  }

  try {
    const response = await fetch(`${backendUrl}/api/onboarding${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const text = await response.text();
    const contentType = response.headers.get('content-type') ?? 'application/json';
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }

    if (parsed !== null && typeof parsed === 'object') {
      return NextResponse.json(parsed, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(text, {
      status: response.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Unable to reach onboarding backend' },
      { status: 502 },
    );
  }
};
