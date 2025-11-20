"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardOverviewController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const getDashboardOverviewController = async (req, res) => {
    const user = req.user;
    const overview = await (0, dashboard_service_1.getDashboardOverview)(user?.firstName || user?.name);
    res.json(overview);
};
exports.getDashboardOverviewController = getDashboardOverviewController;
