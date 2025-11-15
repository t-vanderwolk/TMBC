import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const inviteApi = {
  validate: (code: string) => api.post('/invite/validate', { code }),
  consume: (payload: { code: string; email: string; password: string; name?: string }) =>
    api.post('/invite/consume', payload),
};

export const waitlistApi = {
  join: (payload: { email: string; name?: string }) => api.post('/waitlist/join', payload),
};

export const adminWaitlistApi = {
  listPending: () => api.get('/waitlist/pending'),
  approve: (id: string) => api.post(`/waitlist/approve/${id}`),
  reject: (id: string) => api.post(`/waitlist/reject/${id}`),
};

export const adminInviteApi = {
  list: () => api.get('/invite/list'),
  generate: (payload: { role?: string; email?: string; maxUses?: number }) =>
    api.post('/invite/generate', payload),
  send: (code: string, email: string) => api.post('/invite/send', { code, email }),
};
