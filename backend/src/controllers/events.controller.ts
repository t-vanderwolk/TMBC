import { Request, Response } from 'express';

import { getEvents, rsvpToEvent } from '../services/events.service';

export const getEventsController = async (_req: Request, res: Response) => {
  const items = await getEvents();
  res.json(items);
};

export const getUpcomingEventsController = async (_req: Request, res: Response) => {
  const items = await getEvents();
  res.json(items);
};

export const rsvpEventController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { eventId } = req.body;
  if (!eventId) {
    return res.status(400).json({ error: 'eventId is required' });
  }

  const rsvp = await rsvpToEvent(eventId, user?.id || 'guest');
  res.status(201).json(rsvp);
};
