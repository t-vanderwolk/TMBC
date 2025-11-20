"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../utils/prisma");
const jwt_1 = require("../utils/jwt");
const invite_service_1 = require("./invite.service");
const myregistry_service_1 = require("./myregistry/myregistry.service");
const toSafeUser = (user) => {
    const { password, ...rest } = user;
    return rest;
};
const createAuthPayload = (user) => {
    const payload = {
        userId: user.id,
        role: user.role.toLowerCase(),
        email: user.email,
        name: user.name ?? undefined,
        myRegistryUserId: user.myRegistryUserId ?? undefined,
        myRegistryEmail: user.myRegistryEmail ?? undefined,
    };
    return {
        token: (0, jwt_1.signToken)(payload),
        user: toSafeUser(user),
    };
};
const registerUser = async (input) => {
    const { email, password, name, inviteCode, firstName, lastName, city, state, country, registryType, } = input;
    const allowOpenRegistration = process.env.ALLOW_INVITELESS_REGISTRATION === 'true';
    let user;
    if (inviteCode) {
        user = await (0, invite_service_1.consumeInvite)({
            code: inviteCode,
            email,
            password,
            name,
        });
    }
    else {
        if (!allowOpenRegistration) {
            throw new Error('Invite code is required');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: client_1.Role.MEMBER,
            },
        });
    }
    const nameParts = (name || '').trim().split(/\s+/);
    const normalizedFirstName = firstName?.trim() || nameParts[0] || '';
    const normalizedLastName = lastName?.trim() || nameParts.slice(1).join(' ') || '';
    const signupPayload = {
        Email: email,
        Password: password,
        FirstName: normalizedFirstName,
        LastName: normalizedLastName,
    };
    if (city)
        signupPayload.City = city;
    if (state)
        signupPayload.State = state;
    if (country)
        signupPayload.Country = country;
    if (registryType)
        signupPayload.RegistryType = registryType;
    const myRegistryResult = await myregistry_service_1.MyRegistryService.signupUser(signupPayload);
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            myRegistryUserId: myRegistryResult.myRegistryUserId || null,
            myRegistryEmail: myRegistryResult.email || email,
        },
    });
    const authPayload = createAuthPayload(updatedUser);
    return {
        ...authPayload,
        myRegistry: myRegistryResult,
    };
};
exports.registerUser = registerUser;
const loginUser = async ({ email, password }) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const matches = await bcryptjs_1.default.compare(password, user.password);
    if (!matches) {
        throw new Error('Invalid credentials');
    }
    return createAuthPayload(user);
};
exports.loginUser = loginUser;
