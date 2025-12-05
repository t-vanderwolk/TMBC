import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { api } from '@/lib/api';

export async function requireUser() {
  const token = cookies().get('tm_token')?.value;
  if (!token) {
    redirect('/login');
  }

  try {
    const response = await api.get('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...response.data,
      token,
    };
  } catch {
    redirect('/login');
  }
}

export async function requireAdmin() {
  const user = await requireUser();
  if (String(user.role ?? '').toLowerCase() !== 'admin') {
    redirect('/dashboard');
  }
  return user;
}

export async function requireMentor() {
  const user = await requireUser();
  if (String(user.role ?? '').toLowerCase() !== 'mentor') {
    redirect('/dashboard');
  }
  return user;
}
