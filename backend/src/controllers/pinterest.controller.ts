import { Request, Response } from 'express';

import {
  createPinterestPin,
  decodePinterestState,
  exchangePinterestCode,
  fetchBoardPins,
  fetchUserBoards,
  getPinterestAccessToken,
  getPinterestAuthUrl,
  getStoredPinterestToken,
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

export const fetchPinterestBoardsController = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const accessToken = await getPinterestAccessToken(userId);
    const boards = await fetchUserBoards(accessToken);
    return res.json({ boards });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Unable to fetch Pinterest boards' });
  }
};

export const fetchPinterestBoardPinsController = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const boardId = typeof req.params.boardId === 'string' ? req.params.boardId : undefined;
  if (!boardId) {
    return res.status(400).json({ error: 'Board id is required' });
  }

  try {
    const accessToken = await getPinterestAccessToken(userId);
    const pins = await fetchBoardPins(accessToken, boardId);
    return res.json({ pins });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Unable to fetch Pinterest pins' });
  }
};

export const getPinterestStatusController = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = await getStoredPinterestToken(userId);
    return res.json({
      connected: Boolean(token?.accessToken),
      expiresAt: token?.expiresAt ?? null,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Unable to determine Pinterest status' });
  }
};
