"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCommunityRoomPostController = exports.getRoomPostsController = exports.getCommunityRoomsController = void 0;
const community_service_1 = require("../services/community.service");
const getUser = (req) => req.user;
const getCommunityRoomsController = async (_req, res) => {
    const rooms = await (0, community_service_1.getCommunityRooms)();
    res.json(rooms);
};
exports.getCommunityRoomsController = getCommunityRoomsController;
const getRoomPostsController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'room id is required' });
    }
    const posts = await (0, community_service_1.getRoomPosts)(id);
    res.json(posts);
};
exports.getRoomPostsController = getRoomPostsController;
const postCommunityRoomPostController = async (req, res) => {
    const user = getUser(req);
    const { id } = req.params;
    const { content } = req.body || {};
    if (!user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!id) {
        return res.status(400).json({ error: 'room id is required' });
    }
    if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'content is required' });
    }
    const post = await (0, community_service_1.addCommunityPost)({
        roomId: id,
        userId: user.id,
        content,
    });
    res.status(201).json(post);
};
exports.postCommunityRoomPostController = postCommunityRoomPostController;
