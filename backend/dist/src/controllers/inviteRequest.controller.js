"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitInviteRequest = submitInviteRequest;
exports.adminApproveInvite = adminApproveInvite;
exports.verifyInviteCode = verifyInviteCode;
exports.createInvitedUser = createInvitedUser;
exports.listInviteRequests = listInviteRequests;
const client_1 = require("@prisma/client");
const client_2 = require("../../prisma/client");
const inviteCode_1 = require("../utils/inviteCode");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
async function submitInviteRequest(req, res, next) {
    try {
        const { email, firstName, lastName, message } = req.body;
        const existing = await client_2.prisma.inviteRequest.findUnique({ where: { email } });
        if (existing) {
            return res.json({ ok: true, requestId: existing.id });
        }
        const created = await client_2.prisma.inviteRequest.create({
            data: { email, firstName, lastName, message },
        });
        res.json({ ok: true, requestId: created.id });
    }
    catch (err) {
        next(err);
    }
}
async function adminApproveInvite(req, res, next) {
    try {
        const { requestId, adminId } = req.body;
        const code = (0, inviteCode_1.generateInviteCode)();
        const updated = await client_2.prisma.inviteRequest.update({
            where: { id: requestId },
            data: { status: 'approved', inviteCode: code, approvedById: adminId },
        });
        res.json({ ok: true, inviteCode: updated.inviteCode });
    }
    catch (err) {
        next(err);
    }
}
async function verifyInviteCode(req, res, next) {
    try {
        const { code } = req.body;
        const match = await client_2.prisma.inviteRequest.findFirst({
            where: { inviteCode: code, status: 'approved' },
        });
        if (!match) {
            return res.status(400).json({ error: 'Invalid code' });
        }
        const token = (0, jwt_1.generateToken)({ inviteRequestId: match.id });
        res.json({ ok: true, token });
    }
    catch (err) {
        next(err);
    }
}
async function createInvitedUser(req, res, next) {
    try {
        const { token, email, password, firstName, lastName } = req.body;
        const payload = (0, jwt_1.verifyToken)(token);
        if (!payload?.inviteRequestId) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const hashed = await (0, password_1.hashPassword)(password);
        const user = await client_2.prisma.user.create({
            data: {
                email,
                password: hashed,
                role: client_1.Role.MEMBER,
                profile: {
                    create: {
                        inviteRequestId: payload.inviteRequestId,
                        firstName,
                        lastName,
                    },
                },
            },
        });
        res.json({ ok: true, userId: user.id });
    }
    catch (err) {
        next(err);
    }
}
async function listInviteRequests(_req, res, next) {
    try {
        const requests = await client_2.prisma.inviteRequest.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' },
            include: {
                profile: true,
            },
        });
        const payload = requests.map((request) => ({
            id: request.id,
            email: request.email,
            dueDate: request.profile?.dueDate?.toISOString() ?? null,
            vibe: request.message ?? null,
            supportNeeds: request.message ?? null,
            createdAt: request.createdAt.toISOString(),
            status: request.status,
        }));
        res.json({ data: payload });
    }
    catch (err) {
        next(err);
    }
}
