"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = exports.verifyCode = exports.requestInvite = void 0;
const requestInvite = (req, res) => {
    const { email, name } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    return res.json({
        status: 'received',
        email,
        message: `Hi ${name || 'friend'}, we’ll be in touch soon.`,
    });
};
exports.requestInvite = requestInvite;
const verifyCode = (_req, res) => {
    return res.json({
        valid: true,
        expiresIn: '30m',
    });
};
exports.verifyCode = verifyCode;
const createProfile = (req, res) => {
    const { email, firstName } = req.body;
    return res.json({
        status: 'profile created',
        user: {
            id: `new-user-${Date.now()}`,
            email,
            name: firstName ? `${firstName} Doe` : 'Taylor Member',
            role: 'MEMBER',
            onboardingComplete: true,
        },
    });
};
exports.createProfile = createProfile;
