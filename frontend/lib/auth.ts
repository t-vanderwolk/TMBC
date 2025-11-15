export const Auth = {
  save(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tmbc_token', token);
    }
  },

  get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('tmbc_token');
  },

  clear() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tmbc_token');
    }
  },

  decode(): any | null {
    const token = this.get();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },
};

export type SessionPayload = {
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  [key: string]: any;
};

export type Session = {
  token: string;
  payload: SessionPayload;
};

export const loadSession = (): Session | null => {
  const token = Auth.get();
  if (!token) return null;

  const payload = Auth.decode();
  if (!payload) {
    Auth.clear();
    return null;
  }

  return { token, payload };
};
