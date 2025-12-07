"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminOverviewController = void 0;
const client_1 = require("../../prisma/client");
const getAdminOverviewController = async (_req, res, next) => {
    try {
        const [totalUsers, mentorCount, pendingInvites, registryItems] = await Promise.all([
            client_1.prisma.user.count(),
            client_1.prisma.user.count({ where: { role: 'MENTOR' } }),
            client_1.prisma.inviteRequest.count({
                where: {
                    status: {
                        equals: 'PENDING',
                        mode: 'insensitive',
                    },
                },
            }),
            client_1.prisma.registryItem.count(),
        ]);
        res.json({ totalUsers, mentorCount, pendingInvites, registryItems });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminOverviewController = getAdminOverviewController;
