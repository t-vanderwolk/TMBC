"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardOverviewController = exports.getDashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const getDashboardController = async (req, res) => {
    const user = req.user;
    const data = await (0, dashboard_service_1.getDashboardData)({
        id: user?.id,
        name: user?.name,
        firstName: user?.firstName,
    });
    res.json(data);
};
exports.getDashboardController = getDashboardController;
const getDashboardOverviewController = async (req, res) => {
    const user = req.user;
    const overview = await (0, dashboard_service_1.getDashboardOverview)({
        id: user?.id,
        name: user?.name,
        firstName: user?.firstName,
    });
    res.json(overview);
};
exports.getDashboardOverviewController = getDashboardOverviewController;
