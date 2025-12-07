"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsvpEventController = exports.getUpcomingEventsController = exports.getEventsController = void 0;
const events_service_1 = require("../services/events.service");
const getEventsController = async (req, res) => {
    const user = req.user;
    const scope = req.query.scope === 'upcoming' ? 'upcoming' : undefined;
    const items = await (0, events_service_1.getEvents)(scope, user?.id);
    res.json(items);
};
exports.getEventsController = getEventsController;
const getUpcomingEventsController = async (req, res) => {
    const user = req.user;
    const items = await (0, events_service_1.getEvents)('upcoming', user?.id);
    res.json(items);
};
exports.getUpcomingEventsController = getUpcomingEventsController;
const rsvpEventController = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body || {};
    if (!id) {
        return res.status(400).json({ error: 'event id is required' });
    }
    const normalizedStatus = typeof status === 'string' ? status : 'interested';
    const rsvp = await (0, events_service_1.rsvpToEvent)(id, user?.id || 'guest', normalizedStatus);
    res.status(201).json(rsvp);
};
exports.rsvpEventController = rsvpEventController;
