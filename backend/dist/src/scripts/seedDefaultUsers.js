"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client_2 = require("../../prisma/client");
const password_1 = require("../utils/password");
const DEFAULT_USERS = [
    {
        email: 'member@me.com',
        role: client_1.Role.MEMBER,
        name: 'Taylor Member',
        title: 'Expecting Parent',
    },
    {
        email: 'mentor@me.com',
        role: client_1.Role.MENTOR,
        name: 'Taylor Mentor',
        title: 'Mentor',
    },
    {
        email: 'admin@me.com',
        role: client_1.Role.ADMIN,
        name: 'Taylor Admin',
        title: 'Admin',
    },
];
async function ensureProfile(userId) {
    try {
        await client_2.prisma.profile.upsert({
            where: { userId },
            update: {},
            create: {
                userId,
            },
        });
    }
    catch {
        // If the Profile model does not exist or another error occurs, ignore it.
    }
}
async function main() {
    for (const user of DEFAULT_USERS) {
        const passwordHash = await (0, password_1.hashPassword)('Karma');
        const created = await client_2.prisma.user.upsert({
            where: { email: user.email },
            update: {
                disabled: false,
                name: user.name,
                role: user.role,
                password: passwordHash,
            },
            create: {
                email: user.email,
                password: passwordHash,
                role: user.role,
                disabled: false,
                name: user.name,
            },
        });
        await ensureProfile(created.id);
        console.log(`Seeded ${user.email} (${user.role})${user.title ? ` • ${user.title}` : ''}`);
    }
    console.log('Default login users synced.');
}
main()
    .catch((error) => {
    console.error('Failed to seed default users', error);
    process.exit(1);
})
    .finally(() => process.exit());
