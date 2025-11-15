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
