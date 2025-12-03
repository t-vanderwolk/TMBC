import axios from 'axios';

import { Auth } from './auth';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Auth.get();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      Auth.clear();
    }
    return Promise.reject(error);
  },
);

export const inviteApi = {
  validate: (code: string) => api.post('/invite/validate', { code }),
  consume: (payload: { code: string; email: string; password: string; name?: string }) =>
    api.post('/invite/consume', payload),
};

export const inviteFlowApi = {
  requestInvite: (payload: {
    name: string;
    email: string;
    city?: string;
    dueDate?: string;
    referral?: string;
  }) => api.post('/invite/request', payload),
  verifyInvite: (payload: { email: string; code: string }) => api.post('/invite/verify', payload),
  createProfile: (payload: {
    token: string;
    password: string;
    city?: string;
    dueDate?: string;
    partner?: string;
    experience?: string;
  }) => api.post('/invite/create-profile', payload),
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

export const addCustomItem = (payload: {
  title: string;
  url: string;
  merchant?: string;
  price?: number;
  image?: string;
  category?: string;
  moduleCode?: string;
}) => api.post('/api/registry/custom/add', payload);
