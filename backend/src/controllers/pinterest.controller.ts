import { Request, Response } from 'express';

import {
  createPinterestPin,
  decodePinterestState,
  exchangePinterestCode,
  getPinterestAuthUrl,
  storePinterestToken,
  type PinterestPinPayload,
} from '../services/pinterest.service';

const getUserIdFromRequest = (req: Request) => (req as any).user?.userId as string | undefined;

export const getPinterestAuthController = (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const authUrl = getPinterestAuthUrl(userId);
    return res.json({ authUrl });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Unable to build auth url' });
  }
};

export const getPinterestCallbackController = async (req: Request, res: Response) => {
  const code = typeof req.query.code === 'string' ? req.query.code : undefined;
  const state = typeof req.query.state === 'string' ? req.query.state : undefined;
  const payload = decodePinterestState(state);

  if (!code || !payload?.userId) {
    return res.status(400).send('Invalid Pinterest callback');
  }

  try {
    const tokenData = await exchangePinterestCode(code);
    await storePinterestToken(payload.userId, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    });
    return res.send('<html><body><p>Pinterest connected. You can close this window.</p></body></html>');
  } catch (error: any) {
    return res.status(500).send(`Unable to connect to Pinterest: ${error?.message || 'unknown'}`);
  }
};

export const savePinController = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { imageUrl, note, title, link, boardId } = req.body as PinterestPinPayload;
  if (!imageUrl || !note) {
    return res.status(400).json({ error: 'imageUrl and note are required' });
  }

  try {
    const pin = await createPinterestPin(userId, { imageUrl, note, title, link, boardId });
    return res.json(pin);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Unable to save pin' });
  }
};
