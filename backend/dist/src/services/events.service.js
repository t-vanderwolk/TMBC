"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvpToEvent = exports.getEvents = void 0;
const events = [
    { id: 'event-1', title: 'Nursery Styling Session', type: 'Virtual', date: 'Mar 22 · 6pm CST', location: 'Zoom' },
    { id: 'event-2', title: 'Austin Member Brunch', type: 'In-person', date: 'Mar 24 · 11am CST', location: 'June’s Cafe' },
    { id: 'event-3', title: 'Fourth Trimester Circle', type: 'Virtual', date: 'Mar 26 · 8pm CST', location: 'Zoom' },
];
const getEvents = async () => {
    // TODO: Replace with Prisma event table + filters
    return events;
};
exports.getEvents = getEvents;
const rsvpToEvent = async (eventId, userId) => {
    // TODO: Persist RSVP with user + event relation
    return {
        eventId,
        userId,
        status: 'confirmed',
    };
};
exports.rsvpToEvent = rsvpToEvent;
