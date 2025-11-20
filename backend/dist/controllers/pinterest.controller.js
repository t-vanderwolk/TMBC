"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePinController = exports.getPinterestCallbackController = exports.getPinterestAuthController = void 0;
const pinterest_service_1 = require("../services/pinterest.service");
const getUserIdFromRequest = (req) => req.user?.userId;
const getPinterestAuthController = (req, res) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const authUrl = (0, pinterest_service_1.getPinterestAuthUrl)(userId);
        return res.json({ authUrl });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || 'Unable to build auth url' });
    }
};
exports.getPinterestAuthController = getPinterestAuthController;
const getPinterestCallbackController = async (req, res) => {
    const code = typeof req.query.code === 'string' ? req.query.code : undefined;
    const state = typeof req.query.state === 'string' ? req.query.state : undefined;
    const payload = (0, pinterest_service_1.decodePinterestState)(state);
    if (!code || !payload?.userId) {
        return res.status(400).send('Invalid Pinterest callback');
    }
    try {
        const tokenData = await (0, pinterest_service_1.exchangePinterestCode)(code);
        await (0, pinterest_service_1.storePinterestToken)(payload.userId, {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
        });
        return res.send('<html><body><p>Pinterest connected. You can close this window.</p></body></html>');
    }
    catch (error) {
        return res.status(500).send(`Unable to connect to Pinterest: ${error?.message || 'unknown'}`);
    }
};
exports.getPinterestCallbackController = getPinterestCallbackController;
const savePinController = async (req, res) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { imageUrl, note, title, link, boardId } = req.body;
    if (!imageUrl || !note) {
        return res.status(400).json({ error: 'imageUrl and note are required' });
    }
    try {
        const pin = await (0, pinterest_service_1.createPinterestPin)(userId, { imageUrl, note, title, link, boardId });
        return res.json(pin);
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || 'Unable to save pin' });
    }
};
exports.savePinController = savePinController;
