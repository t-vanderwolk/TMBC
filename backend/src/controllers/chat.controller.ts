import { Request, Response } from 'express';
import { Role } from '@prisma/client';

import { broadcastChatMessage } from '../ws/chat.server';
import { getConversation, getMentorConversations, createChatMessage } from '../services/chat.service';
import { prisma } from '../../prisma/client';

const getUser = (req: Request) => (req as any).user || {};

const normalizeRole = (value?: string): Role => {
  const upper = (value || '').toUpperCase();
  if (upper === 'MENTOR' || upper === 'ADMIN') {
    return Role.MENTOR;
  }
  return Role.MEMBER;
};

const isParticipant = (user: any, mentorId: string, memberId: string) => {
  const userId = String(user?.userId ?? user?.id ?? '');
  const role = String(user?.role ?? '').toLowerCase();
  return (role === 'mentor' && userId === mentorId) || (role === 'member' && userId === memberId);
};

export const getConversationController = async (req: Request, res: Response) => {
  const { mentorId, memberId } = req.params;
  if (!mentorId || !memberId) {
    return res.status(400).json({ error: 'mentorId and memberId are required' });
  }

  const user = getUser(req);
  if (!isParticipant(user, mentorId, memberId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const conversation = await getConversation(mentorId, memberId);
  return res.json(conversation);
};

export const postMessageController = async (req: Request, res: Response) => {
  const { mentorId, memberId, content } = req.body || {};
  if (!mentorId || !memberId || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'mentorId, memberId, and content are required' });
  }

  const user = getUser(req);
  if (!isParticipant(user, mentorId, memberId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const senderId = String(user?.userId ?? user?.id ?? '');
  const senderRole = normalizeRole(user?.role);

  const message = await createChatMessage({
    mentorId,
    memberId,
    senderId,
    senderRole,
    content: content.trim(),
  });

  broadcastChatMessage(message);
  return res.status(201).json(message);
};

export const getCurrentConversationController = async (req: Request, res: Response) => {
  const user = getUser(req);
  const role = String(user?.role ?? '').toLowerCase();
  const memberId = String(user?.userId ?? user?.id ?? '');

  if (role === 'mentor') {
    return res.status(400).json({ error: 'Mentors should use the mentor conversations list' });
  }

  const settings = await prisma.adminSettings.findUnique({ where: { id: 1 } });
  const mentorId = settings?.defaultMentorId ?? process.env.DEFAULT_MENTOR_ID ?? 'user-mentor';
  const messages = await getConversation(mentorId, memberId);
  return res.json({ mentorId, memberId, messages });
};

export const getMentorConversationsController = async (req: Request, res: Response) => {
  const user = getUser(req);
  const mentorId = String(user?.userId ?? user?.id ?? '');
  const conversations = await getMentorConversations(mentorId);
  return res.json(conversations);
};
