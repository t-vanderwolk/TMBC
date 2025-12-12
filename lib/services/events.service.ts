import { prisma } from '@/lib/prisma';

export async function getAllEvents() {
  return prisma.event.findMany({ orderBy: { startTime: 'asc' } });
}

export async function getEvent(eventId: string | number) {
  return prisma.event.findUnique({ where: { id: String(eventId) } });
}

export async function rsvpEvent(
  userId: string,
  eventId: string | number,
  status: 'going' | 'maybe' | 'not going',
) {
  const eventIdStr = String(eventId);
  const normalizedStatus = status.toLowerCase();

  const existing = await prisma.eventRsvp.findFirst({
    where: { eventId: eventIdStr, userId },
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
    data: { eventId: eventIdStr, userId, status: normalizedStatus },
  });

  return {
    eventId: created.eventId,
    userId: created.userId,
    status: created.status,
  };
}

export async function getUserRSVPs(userId: string) {
  return prisma.eventRsvp.findMany({ where: { userId } });
}

export async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: { startTime: { gte: new Date() } },
    orderBy: { startTime: 'asc' },
  });
}
