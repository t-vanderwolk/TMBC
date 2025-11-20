"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvpEventController = exports.getEventsController = void 0;
const events_service_1 = require("../services/events.service");
const getEventsController = async (_req, res) => {
    const items = await (0, events_service_1.getEvents)();
    res.json(items);
};
exports.getEventsController = getEventsController;
const rsvpEventController = async (req, res) => {
    const user = req.user;
    const { eventId } = req.body;
    if (!eventId) {
        return res.status(400).json({ error: 'eventId is required' });
    }
    const rsvp = await (0, events_service_1.rsvpToEvent)(eventId, user?.id || 'guest');
    res.status(201).json(rsvp);
};
exports.rsvpEventController = rsvpEventController;
