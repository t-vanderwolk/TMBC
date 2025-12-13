"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client_2 = require("../../prisma/client");
const password_1 = require("../utils/password");
async function main() {
    const DEFAULTS = [
        { email: 'member@me.com', role: client_1.Role.MEMBER },
        { email: 'mentor@me.com', role: client_1.Role.MENTOR },
        { email: 'admin@me.com', role: client_1.Role.ADMIN },
    ];
    const passwordHash = await (0, password_1.hashPassword)('Karma');
    for (const user of DEFAULTS) {
        await client_2.prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                password: passwordHash,
                role: user.role,
            },
        });
    }
    console.log('Default login users synced.');
}
main().finally(() => process.exit());
