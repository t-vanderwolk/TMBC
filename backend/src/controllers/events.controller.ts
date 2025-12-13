import { Request, Response } from 'express';

import { getEvents, rsvpToEvent } from '../services/events.service';

export const getEventsController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = req.query.scope === 'upcoming' ? 'upcoming' : undefined;
  const items = await getEvents(scope, user?.id);
  res.json(items);
};

export const getUpcomingEventsController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const items = await getEvents('upcoming', user?.id);
  res.json(items);
};

export const rsvpEventController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { status } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: 'event id is required' });
  }

  const normalizedStatus = typeof status === 'string' ? status : 'interested';
  const rsvp = await rsvpToEvent(id, user?.id || 'guest', normalizedStatus);
  res.status(201).json(rsvp);
};
