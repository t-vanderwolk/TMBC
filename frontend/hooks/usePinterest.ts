'use client';

import { useCallback, useMemo, useState } from 'react';

import { api } from '@/lib/api';

export type PinterestSavePayload = {
  title?: string;
  note: string;
  imageUrl: string;
  link?: string;
  boardId?: string;
};

type PinterestStatus = 'idle' | 'authenticating' | 'ready' | 'saving' | 'error';

export const usePinterest = () => {
  const [status, setStatus] = useState<PinterestStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const initiateAuth = useCallback(async () => {
    setStatus('authenticating');
    setMessage(null);
    try {
      const response = await api.get('/api/pinterest/auth');
      const authUrl = response.data?.authUrl;
      if (authUrl) {
      window.open(authUrl, '_blank', 'width=520,height=720');
      setMessage('Pinterest auth window opened. Close it once connected.');
      setStatus('ready');
      } else {
        throw new Error('Missing Pinterest auth url');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error?.response?.data?.error || error?.message || 'Unable to start Pinterest connection');
    }
  }, []);

  const savePin = useCallback(async (payload: PinterestSavePayload) => {
    setStatus('saving');
    setMessage(null);
    try {
      const response = await api.post('/api/pinterest/save-pin', payload);
      setStatus('ready');
      setMessage('Pin saved.');
      setConnected(true);
      return response.data;
    } catch (error: any) {
      setStatus('error');
      const errMsg = error?.response?.data?.error || error?.message || 'Unable to save pin';
      setMessage(errMsg);
      throw new Error(errMsg);
    }
  }, []);

  const summary = useMemo(() => {
    if (status === 'saving' || status === 'authenticating') {
      return 'syncing with Pinterest...';
    }
    if (status === 'error') {
      return message ?? 'connection issue';
    }
    if (connected) {
      return 'Pinterest connected';
    }
    return 'Connect to save pins instantly';
  }, [connected, message, status]);

  return {
    status,
    message,
    connected,
    summary,
    initiateAuth,
    savePin,
  };
};
