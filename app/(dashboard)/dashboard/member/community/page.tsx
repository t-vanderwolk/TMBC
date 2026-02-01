"use server";

import { CommunityPostSourceType, Role } from "@prisma/client";

import CommunityLayout from "@/components/community/CommunityLayout";
import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  CommunityPostDetail,
  CommunityReplyDetail,
  CommunityRoomDetail,
  CommunityRoomSummary,
  getCommunityRoom,
  getCommunityRooms,
} from "@/lib/services/server/community.service";

const MOCK_ROOM_CONFIG: CommunityRoomSummary[] = [
  {
    id: "mock-nesting",
    name: "Nesting reflections",
    description: "Share slow, tactile thoughts as you prepare your space.",
    moduleId: "module-nesting",
    moduleTitle: "Nesting Essentials",
    minRole: Role.MEMBER,
    latestPostSnippet: "Today I finally set up the cozy nap corner. It feels like a quiet anchor.",
    latestPostAuthor: "Avery",
    latestPostAuthorRole: Role.MEMBER,
    latestPostAt: new Date("2025-01-05T10:15:00Z").toISOString(),
  },
  {
    id: "mock-weekly-check",
    name: "Weekly check-ins",
    description: "General questions and calm feedback loops from the community.",
    moduleId: null,
    moduleTitle: null,
    minRole: Role.MEMBER,
    latestPostSnippet: "That reminder to breathe before answering the doorbell really helped.",
    latestPostAuthor: "Mentor Elise",
    latestPostAuthorRole: Role.MENTOR,
    latestPostAt: new Date("2025-01-04T19:45:00Z").toISOString(),
  },
];

const createMockReplies = (overrides?: Partial<CommunityReplyDetail>): CommunityReplyDetail[] => [
  {
    id: "mock-reply-1",
    content: "Lean into that feeling — we hear you. Keep trusting the rhythm.",
    createdAt: new Date("2025-01-05T10:20:00Z").toISOString(),
    authorId: "mentor-elise",
    authorName: "Mentor Elise",
    authorRole: Role.MENTOR,
    ...overrides,
  },
];

const createMockPosts = (roomId: string): CommunityPostDetail[] => [
  {
    id: `${roomId}-post-1`,
    roomId,
    content:
      "I made time to read quietly before the little one woke today. It felt like a small breath before a long week.",
    createdAt: new Date("2025-01-05T10:00:00Z").toISOString(),
    authorId: "user-hannah",
    authorName: "Hannah",
    authorRole: Role.MEMBER,
    isAnnouncement: false,
    isPinned: false,
    pinnedAt: null,
    sourceType: CommunityPostSourceType.COMMUNITY,
    sourceSection: null,
    sourcePrompt: null,
    isAnonymous: false,
    isMentorPrompt: false,
    workbookEntryId: null,
    replies: createMockReplies(),
  },
  {
    id: `${roomId}-post-2`,
    roomId,
    content:
      "Gentle reminder: if you need to pause, fold the laundry tomorrow. There’s deep strength in collecting yourself first.",
    createdAt: new Date("2025-01-04T18:30:00Z").toISOString(),
    authorId: "mentor-elise",
    authorName: "Mentor Elise",
    authorRole: Role.MENTOR,
    isAnnouncement: false,
    isPinned: true,
    pinnedAt: new Date("2025-01-04T18:31:00Z").toISOString(),
    sourceType: CommunityPostSourceType.COMMUNITY,
    sourceSection: null,
    sourcePrompt: null,
    isAnonymous: false,
    isMentorPrompt: true,
    workbookEntryId: null,
    replies: [],
  },
];

const MOCK_ROOM_DETAILS: Record<string, CommunityRoomDetail> = Object.fromEntries(
  MOCK_ROOM_CONFIG.map((room) => [
    room.id,
    {
      id: room.id,
      name: room.name,
      description: room.description,
      moduleId: room.moduleId,
      moduleTitle: room.moduleTitle,
      minRole: room.minRole,
      posts: createMockPosts(room.id),
    },
  ]),
);

export default async function MemberCommunityHomePage() {
  const user = await getUserOrThrow();
  const rooms = await getCommunityRooms(user.role);
  const isMockMode = rooms.length === 0;
  const displayRooms = isMockMode ? MOCK_ROOM_CONFIG : rooms;
  if (!isMockMode && rooms.length === 0) {
    throw new Error("Unable to load community rooms.");
  }
  let initialRoom: CommunityRoomDetail;
  if (isMockMode) {
    const mockRoomId = MOCK_ROOM_CONFIG[0]?.id;
    if (!mockRoomId) {
      throw new Error("Mock community room configuration is invalid.");
    }
    const mockRoom = MOCK_ROOM_DETAILS[mockRoomId];
    if (!mockRoom) {
      throw new Error("Mock community room configuration is invalid.");
    }
    initialRoom = mockRoom;
  } else {
    const firstRoom = rooms[0];
    if (!firstRoom) {
      throw new Error("Unable to load community rooms.");
    }
    initialRoom = await getCommunityRoom(user.role, firstRoom.id);
  }

  return (
    <main className="space-y-6 px-4 py-8 sm:px-6">
      {isMockMode && (
        <section className="rounded-[2.25rem] border border-[#E3C6D4] bg-white/90 p-6 text-sm text-[#3E2F35]/70 shadow-sm">
          <p>Community rooms are still being created. In the meantime, explore this calm preview of how conversations will feel.</p>
        </section>
      )}
      <CommunityLayout
        rooms={displayRooms}
        initialRoom={initialRoom}
        userRole={user.role}
        mockRooms={isMockMode ? MOCK_ROOM_DETAILS : undefined}
      />
    </main>
  );
}
