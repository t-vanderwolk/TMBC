"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.completeOnboarding = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const auth_service_1 = require("../services/auth.service");
const loginEvent_service_1 = require("../services/loginEvent.service");
const client_2 = require("../../prisma/client");
const roleRedirect_1 = require("../utils/roleRedirect");
const register = async (req, res, next) => {
    try {
        const { email, password, name, inviteCode, firstName, lastName, city, state, country, registryType, } = req.body;
        const result = await (0, auth_service_1.registerUser)({
            email,
            password,
            name,
            inviteCode,
            firstName,
            lastName,
            city,
            state,
            country,
            registryType,
        });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const getRequestIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
        return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
        return forwarded[0];
    }
    return req.ip;
};
const login = async (req, res, next) => {
    const { email, password } = req.body;
    const ip = getRequestIp(req);
    const userAgent = req.headers['user-agent']?.toString();
    try {
        const result = await (0, auth_service_1.loginUser)({ email, password });
        if (!result.ok) {
            await (0, loginEvent_service_1.logLoginAttempt)({
                email,
                success: false,
                ip,
                userAgent,
            }).catch(() => null);
            return res.json(result);
        }
        await (0, loginEvent_service_1.logLoginAttempt)({
            user: { id: result.user.id, role: result.user.role },
            email,
            success: true,
            ip,
            userAgent,
        }).catch(() => null);
        const finalDashboard = result.dashboard || result.redirect || (0, roleRedirect_1.dashboardForRole)(result.user.role);
        return res.json({
            success: true,
            user: result.user,
            token: result.token,
            redirect: finalDashboard,
            dashboard: finalDashboard,
        });
    }
    catch (error) {
        await (0, loginEvent_service_1.logLoginAttempt)({
            email,
            success: false,
            ip,
            userAgent,
        }).catch(() => null);
        next(error);
    }
};
exports.login = login;
const completeOnboarding = async (req, res, next) => {
    try {
        const { code, name, password } = req.body;
        if (!code || !name || !password) {
            return res.status(400).json({ error: 'Missing onboarding data' });
        }
        const invite = await client_2.prisma.inviteCode.findUnique({
            where: { code },
        });
        if (!invite) {
            return res.status(400).json({ error: 'Invalid invite code' });
        }
        if (invite.used) {
            return res.status(410).json({ error: 'Invite already used' });
        }
        if (!invite.email) {
            return res.status(400).json({ error: 'Invite is missing an associated email address' });
        }
        const existingUser = await client_2.prisma.user.findUnique({ where: { email: invite.email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists for this invite' });
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await client_2.prisma.user.create({
            data: {
                email: invite.email,
                name,
                password: hashed,
                role: client_1.Role.MEMBER,
                inviteCodeUsed: true,
                profileCompleted: true,
                onboardingComplete: true,
            },
        });
        await client_2.prisma.inviteCode.update({
            where: { id: invite.id },
            data: {
                used: true,
                usedAt: new Date(),
                redeemedById: user.id,
            },
        });
        const loginResult = await (0, auth_service_1.loginUser)({ email: invite.email, password });
        if (!loginResult.ok) {
            throw new Error('Unable to log in after onboarding');
        }
        return res.json(loginResult);
    }
    catch (error) {
        next(error);
    }
};
exports.completeOnboarding = completeOnboarding;
const getCurrentUser = (req, res) => {
    const payload = req.user;
    const tokenHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
    const token = tokenHeader.replace('Bearer ', '') || null;
    res.json({
        token,
        ...payload,
    });
};
exports.getCurrentUser = getCurrentUser;
