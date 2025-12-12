import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { api } from '@/lib/api';
import { PUBLIC_LOGIN_ROUTE, routeForRole } from './auth/routeForRole';

export async function requireUser() {
  const token = cookies().get('tm_token')?.value;
  if (!token) {
    redirect(PUBLIC_LOGIN_ROUTE);
  }

  try {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...response.data,
      token,
    };
  } catch {
    redirect(PUBLIC_LOGIN_ROUTE);
  }
}

export async function requireAdmin() {
  const user = await requireUser();
  if (String(user.role ?? '').toLowerCase() !== 'admin') {
    redirect(routeForRole(user.role));
  }
  return user;
}

export async function requireMentor() {
  const user = await requireUser();
  if (String(user.role ?? '').toLowerCase() !== 'mentor') {
    redirect(routeForRole(user.role));
  }
  return user;
}
