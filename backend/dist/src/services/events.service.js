"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvpToEvent = exports.getEvents = void 0;
const client_1 = require("../../prisma/client");
const mapEvent = (event, userId) => {
    const startTime = event.startTime ?? event.createdAt;
    const userRsvp = userId && event.rsvps.length
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
const getEvents = async (scope, userId) => {
    const where = {};
    if (scope === 'upcoming') {
        where.startTime = { gte: new Date() };
    }
    const events = await client_1.prisma.event.findMany({
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
exports.getEvents = getEvents;
const rsvpToEvent = async (eventId, userId, status = 'interested') => {
    const normalizedStatus = status.toLowerCase();
    const existing = await client_1.prisma.eventRsvp.findFirst({
        where: {
            eventId,
            userId,
        },
    });
    if (existing) {
        const updated = await client_1.prisma.eventRsvp.update({
            where: { id: existing.id },
            data: { status: normalizedStatus },
        });
        return {
            eventId: updated.eventId,
            userId: updated.userId,
            status: updated.status,
        };
    }
    const created = await client_1.prisma.eventRsvp.create({
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
exports.rsvpToEvent = rsvpToEvent;
