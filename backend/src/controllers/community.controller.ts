import { Request, Response } from 'express';

import { addCommunityPost, getCommunityRooms, getRoomPosts } from '../services/community.service';

const getUser = (req: Request) => (req as any).user;

export const getCommunityRoomsController = async (_req: Request, res: Response) => {
  const rooms = await getCommunityRooms();
  res.json(rooms);
};

export const getRoomPostsController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'room id is required' });
  }

  const posts = await getRoomPosts(id);
  res.json(posts);
};

export const postCommunityRoomPostController = async (req: Request, res: Response) => {
  const user = getUser(req);
  const { id } = req.params;
  const { content } = req.body || {};

  if (!user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!id) {
    return res.status(400).json({ error: 'room id is required' });
  }

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'content is required' });
  }

  const post = await addCommunityPost({
    roomId: id,
    userId: user.id,
    content,
  });

  res.status(201).json(post);
};
