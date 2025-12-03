"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consume = exports.validate = exports.listInvites = exports.sendInvite = exports.generate = void 0;
const invite_service_1 = require("../services/invite.service");
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
