"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginStub = void 0;
const devUsers_1 = require("../../utils/devUsers");
const loginStub = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = (0, devUsers_1.findDevUser)(email, password);
    const fallbackUser = {
        id: `member-${email}`,
        email,
        name: 'Taylor Member',
        role: 'MEMBER',
        password,
        title: 'Community Member',
    };
    const effectiveUser = user || fallbackUser;
    const token = (0, devUsers_1.buildSessionToken)(effectiveUser);
    return res.json({
        token,
        user: (0, devUsers_1.sanitizeUser)(effectiveUser),
    });
};
exports.loginStub = loginStub;
