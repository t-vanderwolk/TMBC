"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLoginAttempt = logLoginAttempt;
const client_1 = require("../../prisma/client");
async function logLoginAttempt({ user, email, role, success, ip, userAgent, }) {
    return client_1.prisma.loginEvent.create({
        data: {
            userId: user?.id,
            email,
            role: role ?? user?.role,
            success,
            ip,
            userAgent,
        },
    });
}
