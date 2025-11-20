"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInvites = exports.consumeInvite = exports.validateInvite = exports.generateInvite = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../utils/prisma");
const INVITE_LIMITS = {
    [client_1.Role.MEMBER]: 0,
    [client_1.Role.MENTOR]: 3,
    [client_1.Role.ADMIN]: null,
};
const normalizeRole = (role) => {
    if (!role)
        return client_1.Role.MEMBER;
    const normalized = role.toUpperCase();
    if (!Object.values(client_1.Role).includes(normalized)) {
        return client_1.Role.MEMBER;
    }
    return normalized;
};
const createInviteCode = () => crypto_1.default.randomBytes(8).toString('hex').toUpperCase();
const enforceMentorLimit = async (creatorId, role) => {
    if (role !== client_1.Role.MENTOR)
        return;
    const activeCount = await prisma_1.prisma.invite.count({
        where: { createdById: creatorId, used: false },
    });
    if (activeCount >= (INVITE_LIMITS[client_1.Role.MENTOR] ?? 0)) {
        throw new Error('Mentors can only have three active invites at a time.');
    }
};
const generateInvite = async ({ creatorId, email, role, expiresAt, maxUses = 1, }) => {
    const creator = await prisma_1.prisma.user.findUnique({ where: { id: creatorId } });
    if (!creator) {
        throw new Error('Creator not found');
    }
    const allowedCreatorRoles = [client_1.Role.ADMIN, client_1.Role.MENTOR];
    if (!allowedCreatorRoles.includes(creator.role)) {
        throw new Error('Not allowed to generate invites');
    }
    await enforceMentorLimit(creator.id, creator.role);
    return prisma_1.prisma.invite.create({
        data: {
            code: createInviteCode(),
            createdById: creator.id,
            createdByEmail: creator.email,
            role: normalizeRole(role),
            email,
            expiresAt,
            maxUses,
        },
    });
};
exports.generateInvite = generateInvite;
const validateInvite = async (code) => {
    const invite = await prisma_1.prisma.invite.findUnique({ where: { code } });
    if (!invite) {
        throw new Error('Invite not found');
    }
    if (invite.used) {
        throw new Error('Invite already used');
    }
    if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
        throw new Error('Invite expired');
    }
    return invite;
};
exports.validateInvite = validateInvite;
const consumeInvite = async ({ code, email, password, name, }) => {
    const invite = await (0, exports.validateInvite)(code);
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: invite.role ?? client_1.Role.MEMBER,
        },
    });
    await prisma_1.prisma.invite.update({
        where: { id: invite.id },
        data: {
            used: true,
            usedAt: new Date(),
            usedById: user.id,
        },
    });
    return user;
};
exports.consumeInvite = consumeInvite;
const getAllInvites = () => {
    return prisma_1.prisma.invite.findMany({
        orderBy: { createdAt: 'desc' },
    });
};
exports.getAllInvites = getAllInvites;
