"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchased = exports.removeItem = exports.updateItem = exports.addItem = exports.items = exports.registries = exports.search = exports.signup = void 0;
const myregistry_service_1 = require("../services/myregistry/myregistry.service");
const respondWithError = (res, error) => {
    const normalized = error;
    res.status(normalized.status ?? 500).json(normalized);
};
const signup = async (req, res) => {
    try {
        const payload = req.body;
        const data = await myregistry_service_1.MyRegistryService.signupUser(payload);
        res.json({ status: "ok", data });
    }
    catch (error) {
        respondWithError(res, error);
    }
};
exports.signup = signup;
const search = async (req, res) => {
    try {
        const params = req.query;
        const data = await myregistry_service_1.MyRegistryService.searchRegistries(params);
        res.json({ status: "ok", data });
    }
    catch (error) {
        respondWithError(res, error);
    }
};
exports.search = search;
const registries = async (req, res) => {
    try {
        const params = req.query;
        const data = await myregistry_service_1.MyRegistryService.getRegistries(params);
        res.json({ status: "ok", data });
    }
    catch (error) {
        respondWithError(res, error);
    }
};
exports.registries = registries;
const items = async (req, res) => {
    try {
        const params = req.query;
        const data = await myregistry_service_1.MyRegistryService.getRegistryItems(params);
        res.json({ status: "ok", data });
    }
    catch (error) {
        respondWithError(res, error);
    }
};
exports.items = items;
const addItem = async (req, res) => {
    try {
        const payload = req.body;
        const data = await myregistry_service_1.MyRegistryService.addItem(payload);
        res.json({ status: "ok", data });
    }
    catch (error) {
        respondWithError(res, error);
    }
};
exports.addItem = addItem;
const updateItem = async (req, res) => {
    try {
        const payload = req.body;
        const data = await myregistry_service_1.MyRegistryService.updateItem(payload);
        res.json({ status: "ok", data });
    }
    catch (error) {
        respondWithError(res, error);
    }
};
exports.updateItem = updateItem;
const removeItem = async (req, res) => {
    try {
        const payload = req.body;
        const data = await myregistry_service_1.MyRegistryService.removeItem(payload);
        res.json({ status: "ok", data });
    }
    catch (error) {
        respondWithError(res, error);
    }
};
exports.removeItem = removeItem;
const purchased = async (req, res) => {
    try {
        const payload = req.body;
        const data = await myregistry_service_1.MyRegistryService.markPurchased(payload);
        res.json({ status: "ok", data });
    }
    catch (error) {
        respondWithError(res, error);
    }
};
exports.purchased = purchased;
