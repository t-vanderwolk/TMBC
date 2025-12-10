"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemInvite = exports.validateInvite = exports.consume = exports.validate = exports.listInvites = exports.sendInvite = exports.generate = void 0;
const invite_service_1 = require("../services/invite.service");
const client_1 = require("../../prisma/client");
const jwt_1 = require("../utils/jwt");
const email_service_1 = require("../services/email.service");
const generate = async (req, res, next) => {
    try {
        const { role, email, expiresAt, maxUses, quantity = 1 } = req.body;
        const parsedQuantity = Number(quantity);
        if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }
        const invites = [];
        for (let i = 0; i < parsedQuantity; i += 1) {
            const invite = await (0, invite_service_1.generateInvite)({
                creatorId: req.user.id,
                role,
                email,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined,
                maxUses,
            });
            invites.push(invite);
        }
        res.json({ invites });
    }
    catch (error) {
        next(error);
    }
};
exports.generate = generate;
const sendInvite = async (req, res, next) => {
    try {
        const { code, email } = req.body;
        if (!code || !email) {
            return res.status(400).json({ message: 'Code and email are required' });
        }
        const invite = await (0, invite_service_1.validateInvite)(code);
        await (0, email_service_1.sendInviteEmail)({
            to: email,
            code: invite.code,
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.sendInvite = sendInvite;
const listInvites = async (_req, res, next) => {
    try {
        const invites = await (0, invite_service_1.getAllInvites)();
        res.json({ status: 'ok', invites });
    }
    catch (error) {
        next(error);
    }
};
exports.listInvites = listInvites;
const validate = async (req, res, next) => {
    try {
        const { code } = req.body;
        const invite = await (0, invite_service_1.validateInvite)(code);
        res.json({
            valid: true,
            invite,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.validate = validate;
const consume = async (req, res, next) => {
    try {
        const { code, email, password, name } = req.body;
        const user = await (0, invite_service_1.consumeInvite)({ code, email, password, name });
        const { password: _ignore, ...safeUser } = user;
        res.json({
            token: (0, jwt_1.signToken)({ userId: user.id, role: user.role.toLowerCase() }),
            user: safeUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.consume = consume;
const validateInvite = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Invite code is required' });
        }
        const invite = await client_1.prisma.inviteCode.findUnique({ where: { code } });
        if (!invite) {
            return res.status(400).json({ error: 'Invalid invite code' });
        }
        if (invite.used) {
            return res.status(410).json({ error: 'Invite already used' });
        }
        return res.json({
            valid: true,
            inviteId: invite.id,
            email: invite.email,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.validateInvite = validateInvite;
const redeemInvite = async (req, res) => {
    try {
        const { inviteId, userId } = req.body;
        if (!inviteId || !userId) {
            return res.status(400).json({ error: 'Invite and user IDs are required' });
        }
        const invite = await client_1.prisma.inviteCode.update({
            where: { id: inviteId },
            data: {
                used: true,
                usedAt: new Date(),
                redeemedById: userId,
            },
        });
        await client_1.prisma.user.update({
            where: { id: userId },
            data: {
                profileCompleted: true,
                inviteCodeUsed: true,
            },
        });
        return res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.redeemInvite = redeemInvite;
