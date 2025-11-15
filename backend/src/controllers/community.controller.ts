import { Request, Response } from 'express';

import { getCommunityFeed } from '../services/community.service';

export const getCommunityFeedController = async (_req: Request, res: Response) => {
  const feed = await getCommunityFeed();
  res.json(feed);
};
