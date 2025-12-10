"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnboardingProfile = exports.upsertOnboardingProfile = exports.completeOnboarding = exports.assignMentor = exports.saveProfile = exports.startOnboarding = exports.validateInviteCode = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const client_2 = require("../../prisma/client");
const toDate = (value) => (value ? new Date(value) : undefined);
const createTempPassword = () => crypto_1.default.randomBytes(16).toString('hex');
const validateInviteCode = async (code) => {
    const invite = await client_2.prisma.inviteCode.findUnique({
        where: { code },
    });
    if (!invite) {
        throw new Error('Invalid invite code');
    }
    if (invite.used) {
        throw new Error('Invite code already used');
    }
    return invite;
};
exports.validateInviteCode = validateInviteCode;
const startOnboarding = async (inviteCode) => {
    const invite = await (0, exports.validateInviteCode)(inviteCode);
    if (!invite.email) {
        throw new Error('Invite does not include an email address');
    }
    const defaultName = invite.email.split('@')[0] || 'New Member';
    const tempPassword = createTempPassword();
    const hashedPassword = await bcryptjs_1.default.hash(tempPassword, 10);
    const user = await client_2.prisma.user.create({
        data: {
            email: invite.email,
            name: defaultName,
            role: client_1.Role.MEMBER,
            password: hashedPassword,
            onboardingComplete: false,
        },
    });
    await client_2.prisma.inviteCode.update({
        where: { code: inviteCode },
        data: {
            used: true,
            usedAt: new Date(),
            redeemedById: user.id,
        },
    });
    return user;
};
exports.startOnboarding = startOnboarding;
const saveProfile = async (payload) => {
    const user = await client_2.prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
        throw new Error('User not found');
    }
    return client_2.prisma.user.update({
        where: { id: payload.userId },
        data: {
            name: payload.name ?? user.name,
            dueDate: payload.dueDate ? toDate(payload.dueDate) : user.dueDate,
            location: payload.location ?? user.location,
        },
    });
};
exports.saveProfile = saveProfile;
const assignMentor = async (userId) => {
    const user = await client_2.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }
    const mentor = await client_2.prisma.user.findFirst({
        where: { role: 'MENTOR' },
        orderBy: { createdAt: 'asc' },
    });
    if (!mentor) {
        throw new Error('No mentor available');
    }
    await client_2.prisma.user.update({
        where: { id: userId },
        data: {
            mentorId: mentor.id,
        },
    });
    return mentor;
};
exports.assignMentor = assignMentor;
const completeOnboarding = async (userId) => {
    const user = await client_2.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }
    return client_2.prisma.user.update({
        where: { id: userId },
        data: {
            onboardingComplete: true,
        },
    });
};
exports.completeOnboarding = completeOnboarding;
const upsertOnboardingProfile = async (userId, payload) => {
    return client_2.prisma.onboardingProfile.upsert({
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
    return client_2.prisma.onboardingProfile.findUnique({
        where: { userId },
    });
};
exports.getOnboardingProfile = getOnboardingProfile;
