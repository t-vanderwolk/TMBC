import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export type EventPayload = {
  id: string;
  title: string;
  type?: string | null;
  format?: string | null;
  date: string;
  location?: string | null;
  hostName?: string | null;
  description?: string | null;
  status: string;
  rsvpCount: number;
  userStatus: string | null;
};

type EventScope = 'upcoming';

const mapEvent = (
  event: Prisma.EventGetPayload<{
    include: { rsvps: true; host: { select: { name: true } } };
  }>,
  userId?: string,
): EventPayload => {
  const startTime = event.startTime ?? event.createdAt;
  const userRsvp =
    userId && event.rsvps.length
      ? event.rsvps.find((rsvp) => rsvp.userId === userId)
      : null;

  return {
    id: event.id,
    title: event.title,
    type: event.type,
    format: event.format,
    date: startTime.toISOString(),
    location: event.location,
    hostName: event.hostName ?? event.host?.name ?? 'TMBC',
    description: event.description,
    status: event.status ?? 'scheduled',
    rsvpCount: event.rsvps.length,
    userStatus: userRsvp?.status ?? null,
  };
};

export const getEvents = async (
  scope?: EventScope,
  userId?: string,
): Promise<EventPayload[]> => {
  const where: Prisma.EventWhereInput = {};
  if (scope === 'upcoming') {
    where.startTime = { gte: new Date() };
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      rsvps: true,
      host: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { startTime: 'asc' },
  });

  return events.map((event) => mapEvent(event, userId));
};

export const rsvpToEvent = async (
  eventId: string,
  userId: string,
  status: string = 'interested',
) => {
  const normalizedStatus = status.toLowerCase();
  const existing = await prisma.eventRsvp.findFirst({
    where: {
      eventId,
      userId,
    },
  });

  if (existing) {
    const updated = await prisma.eventRsvp.update({
      where: { id: existing.id },
      data: { status: normalizedStatus },
    });

    return {
      eventId: updated.eventId,
      userId: updated.userId,
      status: updated.status,
    };
  }

  const created = await prisma.eventRsvp.create({
    data: {
      eventId,
      userId,
      status: normalizedStatus,
    },
  });

  return {
    eventId: created.eventId,
    userId: created.userId,
    status: created.status,
  };
};
