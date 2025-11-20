"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWaitlistStatus = exports.getPendingWaitlist = exports.joinWaitlist = void 0;
const prisma_1 = require("../utils/prisma");
const joinWaitlist = async ({ email, name }) => {
    const existing = await prisma_1.prisma.waitlist.findUnique({ where: { email } });
    if (existing) {
        return existing;
    }
    return prisma_1.prisma.waitlist.create({
        data: {
            email,
            name,
        },
    });
};
exports.joinWaitlist = joinWaitlist;
const getPendingWaitlist = async () => {
    return prisma_1.prisma.waitlist.findMany({
        where: { status: 'pending' },
        orderBy: { createdAt: 'asc' },
    });
};
exports.getPendingWaitlist = getPendingWaitlist;
const updateWaitlistStatus = async (id, status) => {
    return prisma_1.prisma.waitlist.update({
        where: { id },
        data: { status },
    });
};
exports.updateWaitlistStatus = updateWaitlistStatus;
