"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodePinterestState = exports.createPinterestPin = exports.getStoredPinterestToken = exports.storePinterestToken = exports.exchangePinterestCode = exports.getPinterestAuthUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("../../prisma/client");
const ensurePinterestConfig = () => {
    const clientId = process.env.PINTEREST_CLIENT_ID;
    const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
    const redirectUri = process.env.PINTEREST_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Pinterest configuration is incomplete');
    }
    return { clientId, clientSecret, redirectUri };
};
const buildState = (userId) => Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64');
const parseState = (state) => {
    if (!state)
        return null;
    try {
        const decoded = Buffer.from(state, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    }
    catch {
        return null;
    }
};
const getPinterestAuthUrl = (userId) => {
    const { clientId, redirectUri } = ensurePinterestConfig();
    const url = new URL('https://www.pinterest.com/oauth/');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope', 'pins:read,pins:write');
    url.searchParams.set('state', buildState(userId));
    return url.toString();
};
exports.getPinterestAuthUrl = getPinterestAuthUrl;
const exchangePinterestCode = async (code) => {
    const { clientId, clientSecret, redirectUri } = ensurePinterestConfig();
    const response = await axios_1.default.post('https://api.pinterest.com/v5/oauth/token', {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};
exports.exchangePinterestCode = exchangePinterestCode;
const storePinterestToken = async (userId, tokenData) => {
    const expiresAt = tokenData.expiresIn ? new Date(Date.now() + tokenData.expiresIn * 1000) : undefined;
    await client_1.prisma.user.update({
        where: { id: userId },
        data: {
            pinterestAccessToken: tokenData.accessToken,
            pinterestRefreshToken: tokenData.refreshToken,
            pinterestTokenExpires: expiresAt,
        },
    });
};
exports.storePinterestToken = storePinterestToken;
const getStoredPinterestToken = async (userId) => {
    const user = await client_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            pinterestAccessToken: true,
            pinterestRefreshToken: true,
            pinterestTokenExpires: true,
        },
    });
    if (!user?.pinterestAccessToken) {
        return null;
    }
    if (user.pinterestTokenExpires && user.pinterestTokenExpires < new Date()) {
        return null;
    }
    return {
        accessToken: user.pinterestAccessToken,
        refreshToken: user.pinterestRefreshToken ?? undefined,
        expiresAt: user.pinterestTokenExpires ?? undefined,
    };
};
exports.getStoredPinterestToken = getStoredPinterestToken;
const createPinterestPin = async (userId, payload) => {
    const token = await (0, exports.getStoredPinterestToken)(userId);
    if (!token) {
        throw new Error('Pinterest credentials are missing or expired');
    }
    const body = {
        note: payload.note,
        image_url: payload.imageUrl,
    };
    if (payload.title) {
        body.title = payload.title;
    }
    if (payload.link) {
        body.link = payload.link;
    }
    const defaultBoardId = process.env.PINTEREST_DEFAULT_BOARD_ID;
    const boardId = payload.boardId || defaultBoardId;
    if (boardId) {
        body.board_id = boardId;
    }
    const response = await axios_1.default.post('https://api.pinterest.com/v5/pins', body, {
        headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};
exports.createPinterestPin = createPinterestPin;
const decodePinterestState = (state) => {
    return parseState(state);
};
exports.decodePinterestState = decodePinterestState;
