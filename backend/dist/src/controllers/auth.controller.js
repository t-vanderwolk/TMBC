"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res, next) => {
    try {
        const { email, password, name, inviteCode, firstName, lastName, city, state, country, registryType, } = req.body;
        const result = await (0, auth_service_1.registerUser)({
            email,
            password,
            name,
            inviteCode,
            firstName,
            lastName,
            city,
            state,
            country,
            registryType,
        });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_1.loginUser)({ email, password });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
