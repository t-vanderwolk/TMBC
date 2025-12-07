"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentees = void 0;
const mentees = [
    {
        id: 'mentee-1',
        name: 'Avery Hart',
        status: 'Nursery build',
        dueDate: '2026-03-12',
    },
    {
        id: 'mentee-2',
        name: 'Noor Bennett',
        status: 'Registry review',
        dueDate: '2026-05-01',
    },
    {
        id: 'mentee-3',
        name: 'Lena Ortiz',
        status: 'Postpartum prep',
        dueDate: '2026-04-20',
    },
];
const getMentees = (_req, res) => {
    return res.json(mentees);
};
exports.getMentees = getMentees;
