"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityFeedController = void 0;
const community_service_1 = require("../services/community.service");
const getCommunityFeedController = async (_req, res) => {
    const feed = await (0, community_service_1.getCommunityFeed)();
    res.json(feed);
};
exports.getCommunityFeedController = getCommunityFeedController;
