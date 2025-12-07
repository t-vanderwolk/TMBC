"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommunityPost = exports.getRoomPosts = exports.getCommunityRooms = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("../../prisma/client");
const mapPost = (post) => ({
    id: post.id,
    roomId: post.roomId,
    roomName: post.room?.name ?? 'Community',
    userId: post.userId,
    author: post.user?.name ?? 'Member',
    content: post.content,
    createdAt: post.createdAt?.toISOString() ?? new Date().toISOString(),
});
const getCommunityRooms = async () => {
    const rooms = await client_2.prisma.communityRoom.findMany({
        include: {
            posts: {
                where: {
                    user: {
                        role: client_1.Role.MEMBER,
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });
    return rooms.map((room) => {
        const latest = room.posts?.[0];
        return {
            id: room.id,
            name: room.name,
            description: room.description,
            recentPostSnippet: latest?.content ?? null,
            recentPostAuthor: latest?.user?.name ?? null,
            recentPostAt: latest?.createdAt ? latest.createdAt.toISOString() : null,
        };
    });
};
exports.getCommunityRooms = getCommunityRooms;
const getRoomPosts = async (roomId) => {
    const posts = await client_2.prisma.communityPost.findMany({
        where: {
            roomId,
            user: {
                role: client_1.Role.MEMBER,
            },
        },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
            room: {
                select: {
                    name: true,
                },
            },
        },
    });
    return posts.map(mapPost);
};
exports.getRoomPosts = getRoomPosts;
const addCommunityPost = async ({ roomId, userId, content }) => {
    const author = await client_2.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
    if (!author || author.role !== client_1.Role.MEMBER) {
        throw new Error('Only members can post in the community rooms.');
    }
    const room = await client_2.prisma.communityRoom.findUnique({
        where: { id: roomId },
        include: { posts: true },
    });
    if (!room) {
        throw new Error('Community room not found');
    }
    const post = await client_2.prisma.communityPost.create({
        data: {
            roomId,
            userId,
            content,
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
            room: {
                select: {
                    name: true,
                },
            },
        },
    });
    return mapPost(post);
};
exports.addCommunityPost = addCommunityPost;
