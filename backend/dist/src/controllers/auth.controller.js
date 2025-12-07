"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const loginEvent_service_1 = require("../services/loginEvent.service");
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
        await (0, loginEvent_service_1.logLoginAttempt)({
            user: result.user,
            email,
            success: true,
            ip,
            userAgent,
        }).catch(() => null);
        res.json(result);
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
