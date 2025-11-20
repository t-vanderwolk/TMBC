"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleRecommendedListController = exports.getModuleRecommendationsController = exports.getModuleProductsController = exports.getRecommendedModuleController = exports.getModulesController = exports.getTracksController = exports.getJourneysController = void 0;
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
const getModulesController = async (_req, res) => {
    const modules = await (0, academy_service_1.getAcademyModules)();
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
