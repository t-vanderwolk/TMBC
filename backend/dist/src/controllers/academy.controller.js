"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgressController = exports.completeModuleController = exports.getModuleRecommendedListController = exports.getModuleRecommendationsController = exports.getModuleProductsController = exports.getRecommendedModuleController = exports.getModulesController = exports.getTracksController = exports.getJourneysController = void 0;
const academy_service_1 = require("../services/academy.service");
const getJourneysController = async (_req, res) => {
    const journeys = await (0, academy_service_1.getAcademyJourneys)();
    res.json(journeys);
};
exports.getJourneysController = getJourneysController;
const getTracksController = async (_req, res) => {
    const tracks = await (0, academy_service_1.getAcademyTracks)();
    res.json(tracks);
};
exports.getTracksController = getTracksController;
const getModulesController = async (req, res) => {
    const user = req.user;
    const modules = await (0, academy_service_1.getModulesWithProgress)(user?.id);
    res.json(modules);
};
exports.getModulesController = getModulesController;
const getRecommendedModuleController = async (_req, res) => {
    const module = await (0, academy_service_1.getRecommendedModule)();
    res.json(module);
};
exports.getRecommendedModuleController = getRecommendedModuleController;
const getModuleProductsController = async (req, res) => {
    try {
        const { moduleCode } = req.params;
        const data = await (0, academy_service_1.getModuleProducts)(moduleCode);
        res.json(data);
    }
    catch (error) {
        res.status(404).json({ error: error?.message || 'Module not found' });
    }
};
exports.getModuleProductsController = getModuleProductsController;
const getModuleRecommendationsController = async (req, res) => {
    try {
        const { moduleCode } = req.params;
        const data = await (0, academy_service_1.getModuleRecommendations)(moduleCode);
        res.json(data);
    }
    catch (error) {
        res.status(404).json({ error: error?.message || 'Module not found' });
    }
};
exports.getModuleRecommendationsController = getModuleRecommendationsController;
const getModuleRecommendedListController = async (req, res) => {
    try {
        const { moduleCode } = req.params;
        const products = await (0, academy_service_1.getModuleRecommendedProductsList)(moduleCode);
        res.json({
            moduleCode,
            products,
        });
    }
    catch (error) {
        res.status(404).json({ error: error?.message || 'Module not found' });
    }
};
exports.getModuleRecommendedListController = getModuleRecommendedListController;
const completeModuleController = async (req, res) => {
    const user = req.user;
    const userId = user?.id;
    const { moduleId } = req.body || {};
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!moduleId) {
        return res.status(400).json({ error: 'moduleId is required' });
    }
    try {
        const completedModuleId = await (0, academy_service_1.completeModuleForUser)(userId, moduleId);
        const summary = await (0, academy_service_1.getUserProgressSummary)(userId);
        return res.json({ moduleId: completedModuleId, summary });
    }
    catch (error) {
        return res.status(400).json({ error: error?.message || 'Unable to complete module' });
    }
};
exports.completeModuleController = completeModuleController;
const getProgressController = async (req, res) => {
    const user = req.user;
    const progress = await (0, academy_service_1.getUserProgressSummary)(user?.id);
    return res.json(progress);
};
exports.getProgressController = getProgressController;
