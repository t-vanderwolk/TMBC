"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTempToken = exports.signTempToken = exports.verifyToken = exports.generateToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    return process.env.JWT_SECRET;
};
const getTempSecret = () => {
    return process.env.JWT_TEMP_SECRET || getSecret();
};
const signToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getSecret(), {
        expiresIn: '7d',
    });
};
exports.signToken = signToken;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getSecret(), { expiresIn: '30m' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, getSecret());
};
exports.verifyToken = verifyToken;
const signTempToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getTempSecret(), {
        expiresIn: '1h',
    });
};
exports.signTempToken = signTempToken;
const verifyTempToken = (token) => {
    return jsonwebtoken_1.default.verify(token, getTempSecret());
};
exports.verifyTempToken = verifyTempToken;
