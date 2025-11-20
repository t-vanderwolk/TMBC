"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRegistryService = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "https://api.myregistry.com/RegistryApi/1/0/json/";
const apiToken = process.env.MYREGISTRY_API_TOKEN;
if (!apiToken) {
    throw new Error("Missing MYREGISTRY_API_TOKEN in environment variables.");
}
const axiosConfig = {
    baseURL: BASE_URL,
    headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        ApiToken: apiToken,
    },
};
const basicAuthUser = process.env.MYREGISTRY_BASIC_AUTH_USERNAME;
const basicAuthPassword = process.env.MYREGISTRY_BASIC_AUTH_PASSWORD;
if (basicAuthUser && basicAuthPassword) {
    axiosConfig.auth = {
        username: basicAuthUser,
        password: basicAuthPassword,
    };
}
const client = axios_1.default.create(axiosConfig);
const handleError = (error) => {
    if (axios_1.default.isAxiosError(error)) {
        throw {
            status: error.response?.status ?? 500,
            message: error.response?.data ?? error.message,
        };
    }
    throw {
        status: 500,
        message: error instanceof Error ? error.message : "Unknown MyRegistry error",
    };
};
const normalizeSignupResponse = (payload) => {
    const normalizedId = payload["RegistryId"] ??
        payload["RegistryUserId"] ??
        payload["UserId"] ??
        payload["MemberId"] ??
        payload["memberId"] ??
        payload["id"] ??
        "";
    const normalizedEmail = payload["Email"] ??
        payload["email"] ??
        payload["registryEmail"] ??
        "";
    return {
        myRegistryUserId: normalizedId,
        email: normalizedEmail,
        raw: payload,
    };
};
exports.MyRegistryService = {
    async signupUser(payload) {
        try {
            const response = await client.post("SignupUser", payload);
            return normalizeSignupResponse(response.data ?? {});
        }
        catch (error) {
            return handleError(error);
        }
    },
    async searchRegistries(params) {
        try {
            const response = await client.get("GetRegistries2", { params });
            return response.data;
        }
        catch (error) {
            handleError(error);
        }
    },
    async getRegistries(params) {
        try {
            const response = await client.get("GetRegistries", { params });
            return response.data;
        }
        catch (error) {
            handleError(error);
        }
    },
    async getRegistryItems(params) {
        try {
            const response = await client.get("GetRegistryItems", { params });
            return response.data;
        }
        catch (error) {
            handleError(error);
        }
    },
    async addItem(payload) {
        try {
            const response = await client.post("AddItemToRegistry", payload);
            return response.data;
        }
        catch (error) {
            handleError(error);
        }
    },
    async updateItem(payload) {
        try {
            const response = await client.post("UpdateItem", payload);
            return response.data;
        }
        catch (error) {
            handleError(error);
        }
    },
    async removeItem(payload) {
        try {
            const response = await client.post("RemoveItemFromRegistry", payload);
            return response.data;
        }
        catch (error) {
            handleError(error);
        }
    },
    async markPurchased(payload) {
        try {
            const response = await client.post("SetGiftAsPurchased", payload);
            return response.data;
        }
        catch (error) {
            handleError(error);
        }
    },
};
