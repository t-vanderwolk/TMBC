'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { api } from '@/lib/api';

export type PinterestSavePayload = {
  title?: string;
  note: string;
  imageUrl: string;
  link?: string;
  boardId?: string;
};

export type PinterestBoard = {
  id: string;
  name: string;
  description?: string | null;
  privacy?: string | null;
  cover_image?: {
    url?: string | null;
  };
};

export type PinterestPin = {
  id: string;
  title?: string | null;
  description?: string | null;
  note?: string | null;
  link?: string | null;
  media?: {
    images?: Record<string, { url: string }>;
  };
  domain?: string | null;
};

type PinterestStatus = 'idle' | 'authenticating' | 'ready' | 'saving' | 'error';

export const usePinterest = () => {
  const [status, setStatus] = useState<PinterestStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const [boards, setBoards] = useState<PinterestBoard[]>([]);
  const [pinsByBoard, setPinsByBoard] = useState<Record<string, PinterestPin[]>>({});
  const boardPinsRef = useRef<Record<string, PinterestPin[]>>({});
  const [selectedBoard, setSelectedBoard] = useState<PinterestBoard | null>(null);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [loadingPins, setLoadingPins] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const initiateAuth = useCallback(async () => {
    setStatus('authenticating');
    setMessage(null);
    try {
      const response = await api.get('/api/pinterest/auth');
      const authUrl = response.data?.authUrl;
      if (!authUrl) {
        throw new Error('Missing Pinterest auth url');
      }
      window.open(authUrl, '_blank', 'width=520,height=720');
      setStatus('ready');
      setMessage('Pinterest auth window opened. Close it once connected.');
    } catch (error: any) {
      setStatus('error');
      setMessage(
        error?.response?.data?.error || error?.message || 'Unable to start Pinterest connection',
      );
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

  const loadBoards = useCallback(async () => {
    setLoadingBoards(true);
    setPickerError(null);
    try {
      const response = await api.get('/api/pinterest/boards');
      const fetchedBoards: PinterestBoard[] = response.data?.boards ?? [];
      setBoards(fetchedBoards);
      setConnected(true);
      return fetchedBoards;
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error || error?.message || 'Unable to load Pinterest boards';
      setPickerError(errMsg);
      setConnected(false);
      return [];
    } finally {
      setLoadingBoards(false);
    }
  }, []);

  const loadPins = useCallback(async (boardId: string) => {
    if (!boardId) {
      return [];
    }

    if (boardPinsRef.current[boardId]) {
      setPinsByBoard({ ...boardPinsRef.current });
      return boardPinsRef.current[boardId];
    }

    setLoadingPins(true);
    setPickerError(null);
    try {
      const response = await api.get(`/api/pinterest/boards/${boardId}/pins`);
      const fetchedPins: PinterestPin[] = response.data?.pins ?? [];
      boardPinsRef.current = { ...boardPinsRef.current, [boardId]: fetchedPins };
      setPinsByBoard({ ...boardPinsRef.current });
      return fetchedPins;
    } catch (error: any) {
      const errMsg = error?.response?.data?.error || error?.message || 'Unable to load Pinterest pins';
      setPickerError(errMsg);
      return [];
    } finally {
      setLoadingPins(false);
    }
  }, []);

  const selectBoard = useCallback(
    async (board: PinterestBoard) => {
      setSelectedBoard(board);
      await loadPins(board.id);
    },
    [loadPins],
  );

  const openPicker = useCallback(() => {
    setPickerError(null);
    setIsPickerOpen(true);
    setSelectedBoard(null);
    if (!boards.length) {
      void loadBoards();
    }
  }, [boards.length, loadBoards]);

  const closePicker = useCallback(() => {
    setIsPickerOpen(false);
    setSelectedBoard(null);
  }, []);

  const currentPins = selectedBoard ? pinsByBoard[selectedBoard.id] ?? [] : [];

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
    boards,
    loadingBoards,
    loadingPins,
    selectedBoard,
    selectBoard,
    pins: currentPins,
    pickerError,
    isPickerOpen,
    openPicker,
    closePicker,
  };
};

export type UsePinterestReturn = ReturnType<typeof usePinterest>;
