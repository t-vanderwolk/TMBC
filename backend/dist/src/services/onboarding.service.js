"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnboardingProfile = exports.upsertOnboardingProfile = void 0;
const client_1 = require("../../prisma/client");
const upsertOnboardingProfile = async (userId, payload) => {
    return client_1.prisma.onboardingProfile.upsert({
        where: { userId },
        create: {
            userId,
            answers: payload.answers,
            recommendations: payload.recommendations,
            status: payload.status,
        },
        update: {
            answers: payload.answers,
            recommendations: payload.recommendations,
            status: payload.status,
        },
    });
};
exports.upsertOnboardingProfile = upsertOnboardingProfile;
const getOnboardingProfile = async (userId) => {
    return client_1.prisma.onboardingProfile.findUnique({
        where: { userId },
    });
};
exports.getOnboardingProfile = getOnboardingProfile;
