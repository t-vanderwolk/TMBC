import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAMES_TO_CLEAR = [
  'tm_token',
  'tmbc_token',
  'sb-access-token',
  'sb-refresh-token',
  'supabase-access-token',
  'supabase-refresh-token',
  'supabase-auth-token',
];

const SUPABASE_REFRESH_TOKEN_NAMES = ['sb-refresh-token', 'supabase-refresh-token'];

const getCookieValue = (request: NextRequest, names: string[]) => {
  for (const name of names) {
    const value = request.cookies.get(name)?.value;
    if (value) {
      return value;
    }
  }
  return null;
};

const clearAuthCookies = (response: NextResponse) => {
  for (const cookieName of COOKIE_NAMES_TO_CLEAR) {
    response.cookies.set(cookieName, '', {
      path: '/',
      maxAge: 0,
    });
  }
};

const attemptSupabaseSignOut = async (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return;
  }

  try {
    const { supabaseAdmin } = await import('@/lib/auth/supabaseClient');
    const refreshToken = getCookieValue(request, SUPABASE_REFRESH_TOKEN_NAMES);
    await supabaseAdmin.auth.signOut({ refreshToken });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase sign out failed', error);
    }
  }
};

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  await attemptSupabaseSignOut(request);
  return response;
}
