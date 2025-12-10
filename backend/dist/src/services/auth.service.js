"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_2 = require("../../prisma/client");
const jwt_1 = require("../utils/jwt");
const invite_service_1 = require("./invite.service");
const myregistry_service_1 = require("./myregistry/myregistry.service");
const roleRedirect_1 = require("../utils/roleRedirect");
const hasProfile = async (userId) => {
    const count = await client_2.prisma.profile.count({
        where: { userId },
    });
    return count > 0;
};
const buildAuthUser = (user, profileCompleted) => {
    const normalizedRole = user.role.toUpperCase();
    const finalProfileCompleted = user.profileCompleted || profileCompleted;
    const inviteFlag = Boolean(user.inviteCodeUsed);
    return {
        id: user.id,
        userId: user.id,
        email: user.email,
        name: user.name ?? null,
        role: normalizedRole,
        onboardingComplete: user.onboardingComplete,
        profileCompleted: finalProfileCompleted,
        inviteCodeUsed: inviteFlag,
    };
};
const createAuthPayload = (user, profileCompleted) => {
    const authUser = buildAuthUser(user, profileCompleted);
    return {
        token: (0, jwt_1.signToken)(authUser),
        user: {
            id: authUser.id,
            email: authUser.email,
            name: authUser.name ?? undefined,
            role: authUser.role,
            onboardingComplete: authUser.onboardingComplete,
            profileCompleted: authUser.profileCompleted,
            inviteCodeUsed: authUser.inviteCodeUsed,
        },
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
        user = await client_2.prisma.user.create({
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
    const updatedUser = await client_2.prisma.user.update({
        where: { id: user.id },
        data: {
            myRegistryUserId: myRegistryResult.myRegistryUserId || null,
            myRegistryEmail: myRegistryResult.email || email,
        },
    });
    const profileExists = await hasProfile(updatedUser.id);
    const profileComplete = updatedUser.profileCompleted || profileExists;
    const authPayload = createAuthPayload(updatedUser, profileComplete);
    return {
        ...authPayload,
        myRegistry: myRegistryResult,
    };
};
exports.registerUser = registerUser;
const loginUser = async ({ email, password }) => {
    const user = await client_2.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const matches = await bcryptjs_1.default.compare(password, user.password);
    if (!matches) {
        throw new Error('Invalid credentials');
    }
    const profileExists = await hasProfile(user.id);
    const profileComplete = user.profileCompleted || profileExists;
    const authPayload = createAuthPayload(user, profileComplete);
    const normalizedRole = (user.role || "MEMBER").toUpperCase().trim();
    // Compute proper dashboard URL using normalized role
    const retarget = (0, roleRedirect_1.dashboardForRole)(normalizedRole);
    return {
        ok: true,
        ...authPayload,
        redirect: retarget,
        dashboard: retarget,
    };
};
exports.loginUser = loginUser;
