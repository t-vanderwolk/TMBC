"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUser = exports.parseSessionToken = exports.buildSessionToken = exports.findDevUser = exports.getDevUsers = void 0;
const devUsers = [
    {
        id: 'user-member',
        email: 'member@me.com',
        name: 'Taylor Member',
        role: 'MEMBER',
        password: 'member123',
        title: 'Expecting Parent',
    },
    {
        id: 'user-mentor',
        email: 'mentor@me.com',
        name: 'Taylor Mentor',
        role: 'MENTOR',
        password: 'mentor123',
        title: 'Mentor',
    },
    {
        id: 'user-admin',
        email: 'admin@me.com',
        name: 'Taylor Admin',
        role: 'ADMIN',
        password: 'admin123',
        title: 'Community Lead',
    },
];
const getDevUsers = () => devUsers;
exports.getDevUsers = getDevUsers;
const findDevUser = (email, password) => {
    return devUsers.find((user) => user.email === email && user.password === password) || null;
};
exports.findDevUser = findDevUser;
const buildSessionToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        title: user.title,
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
};
exports.buildSessionToken = buildSessionToken;
const parseSessionToken = (token) => {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);
        return {
            id: parsed.id,
            email: parsed.email,
            name: parsed.name,
            role: parsed.role,
            title: parsed.title,
        };
    }
    catch {
        return null;
    }
};
exports.parseSessionToken = parseSessionToken;
const sanitizeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
});
exports.sanitizeUser = sanitizeUser;
