"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnboardingProfileController = exports.saveOnboardingProfileController = void 0;
const onboarding_service_1 = require("../services/onboarding.service");
const recommendations_1 = require("../utils/recommendations");
const getUserId = (req) => req.user?.id;
const determineStatus = (answers) => {
    const hasAnswers = Object.values(answers).some((value) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
            return true;
        }
        return Boolean(value);
    });
    return hasAnswers ? 'completed' : 'in_progress';
};
const saveOnboardingProfileController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const answers = (req.body?.answers ?? {});
    const recommendations = (0, recommendations_1.generateRecommendations)(answers);
    const status = determineStatus(answers);
    const onboardingProfile = await (0, onboarding_service_1.upsertOnboardingProfile)(userId, {
        answers: answers,
        recommendations: recommendations,
        status,
    });
    res.json({ onboardingProfile });
};
exports.saveOnboardingProfileController = saveOnboardingProfileController;
const getOnboardingProfileController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const onboardingProfile = await (0, onboarding_service_1.getOnboardingProfile)(userId);
    res.json({ onboardingProfile });
};
exports.getOnboardingProfileController = getOnboardingProfileController;
