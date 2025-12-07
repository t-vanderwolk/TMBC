"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRooms = void 0;
const rooms = [
    { id: 'due-q1', title: 'Due Jan–Mar', members: 42, vibe: 'Calm planning', tag: 'circle' },
    { id: 'twins', title: 'Twin Parents', members: 18, vibe: 'Hands-on prep', tag: 'support' },
    { id: 'second', title: 'Second-time Parents Club', members: 26, vibe: 'Confident + curious', tag: 'story' },
];
const getRooms = (_req, res) => {
    return res.json(rooms);
};
exports.getRooms = getRooms;
