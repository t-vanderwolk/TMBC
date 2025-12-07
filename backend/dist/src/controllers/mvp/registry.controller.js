"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = void 0;
const getSummary = (_req, res) => {
    return res.json({
        totalItems: 18,
        essentials: 9,
        niceToHave: 6,
        rows: [
            {
                id: 'sleep',
                title: 'Sleep Suite',
                status: 'hand-off scheduled',
                essentials: 4,
                niceToHave: 1,
            },
            {
                id: 'feeding',
                title: 'Feeding Essentials',
                status: 'awaiting review',
                essentials: 3,
                niceToHave: 2,
            },
            {
                id: 'travel',
                title: 'Travel & Outings',
                status: 'curated',
                essentials: 2,
                niceToHave: 3,
            },
        ],
    });
};
exports.getSummary = getSummary;
