"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOnboardingController = exports.assignMentorController = exports.saveProfileController = exports.startOnboardingController = exports.validateInviteCodeController = void 0;
const onboarding_service_1 = require("../services/onboarding.service");
const sendError = (res, error) => {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return res.status(400).json({ error: message });
};
const validateInviteCodeController = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Invite code is required' });
        }
        const invite = await (0, onboarding_service_1.validateInviteCode)(code);
        return res.json({ invite });
    }
    catch (error) {
        return sendError(res, error);
    }
};
exports.validateInviteCodeController = validateInviteCodeController;
const startOnboardingController = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        if (!inviteCode) {
            return res.status(400).json({ error: 'Invite code is required' });
        }
        const user = await (0, onboarding_service_1.startOnboarding)(inviteCode);
        return res.json({ user });
    }
    catch (error) {
        return sendError(res, error);
    }
};
exports.startOnboardingController = startOnboardingController;
const saveProfileController = async (req, res) => {
    try {
        const { userId, name, dueDate, location } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const user = await (0, onboarding_service_1.saveProfile)({ userId, name, dueDate, location });
        return res.json({ user });
    }
    catch (error) {
        return sendError(res, error);
    }
};
exports.saveProfileController = saveProfileController;
const assignMentorController = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const mentor = await (0, onboarding_service_1.assignMentor)(userId);
        return res.json({ mentor });
    }
    catch (error) {
        return sendError(res, error);
    }
};
exports.assignMentorController = assignMentorController;
const completeOnboardingController = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const user = await (0, onboarding_service_1.completeOnboarding)(userId);
        return res.json({ user });
    }
    catch (error) {
        return sendError(res, error);
    }
};
exports.completeOnboardingController = completeOnboardingController;
