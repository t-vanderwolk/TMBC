import { ConversationMessage, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ChatParticipant = {
  id: string;
  name?: string | null;
  role: Role;
};

export type ChatMessageDTO = {
  id: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderRole: Role | null;
  conversationId: string;
  createdAt: Date;
  readAt: Date | null;
  isSystem: boolean;
};

export type Actor = {
  id: string;
  role: Role;
};

export type ChatActor = Actor & {
  name?: string | null;
};

type ConversationMessageWithSender = ConversationMessage & {
  sender: {
    id: string;
    name: string | null;
    role: Role;
  } | null;
};

type ConversationParticipantInfo = {
  id: string;
  name: string | null;
  role: Role;
  mentorId: string | null;
};

const participantSelect = {
  id: true,
  name: true,
  role: true,
  mentorId: true,
};

class ChatPermissionError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.status = status;
    this.name = "ChatPermissionError";
  }
}

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimits = new Map<string, RateLimitEntry>();

const enforceRateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const existing = rateLimits.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (existing.count >= limit) {
    throw new ChatPermissionError("You are sending messages too quickly. Please wait a moment.", 429);
  }

  existing.count += 1;
};
// INTENTIONAL: This polling-friendly guard remains until the WebSocket layer is production ready.

type AllowedMentorCache = Map<string, Set<string>>;

const getAllowedMentorsForMember = async (
  memberId: string,
  cache: AllowedMentorCache = new Map(),
): Promise<Set<string>> => {
  if (cache.has(memberId)) {
    return cache.get(memberId)!;
  }

  const allowed = new Set<string>();
  const member = await prisma.user.findUnique({
    where: { id: memberId },
    select: { mentorId: true },
  });

  if (member?.mentorId) {
    allowed.add(member.mentorId);
  }

  cache.set(memberId, allowed);
  return allowed;
};

export type ChatAutomationReason = "onboarding" | "assignment" | "event" | "registry";

export type ChatAutomationContext = {
  eventId?: string;
  eventTitle?: string;
};

type EnsureConversationInput = {
  memberId: string;
  mentorId: string;
  reason: ChatAutomationReason;
  initiatorId?: string;
  context?: ChatAutomationContext;
};

const findExistingConversation = async (participantIds: string[]) => {
  const uniqueIds = Array.from(new Set(participantIds));
  if (!uniqueIds.length) return null;
  return prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { every: { id: { in: uniqueIds } } } },
        { participants: { none: { id: { notIn: uniqueIds } } } },
      ],
    },
    include: {
      participants: { select: participantSelect },
    },
  });
};

const systemMessageTemplates: Record<
  ChatAutomationReason,
  (context?: ChatAutomationContext) => string | null
> = {
  onboarding: () => "You’re all set. This space is here whenever you need support.",
  assignment: () => "Your mentor has been assigned. You can message them anytime.",
  event: (context) =>
    context?.eventTitle
      ? `Thanks for attending “${context.eventTitle}”. Feel free to continue the conversation here.`
      : "Thanks for attending. Feel free to continue the conversation here.",
  registry: () =>
    "Your registry is coming together beautifully — reach out if you’d like a second set of eyes.",
};

export const sendSystemMessageOnce = async ({
  conversationId,
  type,
  context,
  text,
}: {
  conversationId: string;
  type: ChatAutomationReason;
  context?: ChatAutomationContext;
  text?: string;
}) => {
  const messageText = text ?? systemMessageTemplates[type]?.(context);
  if (!messageText) {
    return null;
  }

  const existing = await prisma.conversationMessage.findFirst({
    where: {
      conversationId,
      isSystem: true,
      content: messageText,
    },
  });

  if (existing) {
    console.info(`[Concierge] System message already present (type: ${type})`);
    return existing;
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        select: participantSelect,
      },
    },
  });

  const mentor =
    conversation?.participants.find((participant) => participant.role === Role.MENTOR) ??
    conversation?.participants[0];
  const senderId = mentor?.id;

  if (!senderId) {
    console.warn("[Concierge] Unable to determine sender for system message", {
      conversationId,
      type,
    });
    return null;
  }

  const message = await prisma.conversationMessage.create({
    data: {
      conversationId,
      senderId,
      content: messageText,
      isSystem: true,
    },
  });

  console.info(`[Concierge] System message sent (type: ${type})`);
  return message;
};

export const ensureConversationBetweenUsers = async (input: EnsureConversationInput) => {
  const { memberId, mentorId, reason, initiatorId, context } = input;
  const participants = await prisma.user.findMany({
    where: { id: { in: [memberId, mentorId] } },
    select: { id: true, role: true },
  });
  const member = participants.find((participant) => participant.id === memberId);
  const mentor = participants.find((participant) => participant.id === mentorId);

  if (!member || member.role !== Role.MEMBER || !mentor || mentor.role !== Role.MENTOR) {
    console.warn("[ChatAutomation] Invalid participants for conversation automation", {
      memberId,
      mentorId,
    });
    return null;
  }

  const existing = await findExistingConversation([memberId, mentorId]);
  if (existing) {
    console.info(
      `[ChatAutomation] Conversation already exists for member ${memberId} and mentor ${mentorId}`,
    );
    return existing;
  }

  const initiator =
    initiatorId && initiatorId !== memberId
      ? await prisma.user.findUnique({ where: { id: initiatorId }, select: { id: true, role: true } })
      : { id: memberId, role: member.role };
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: member.id }, { id: mentor.id }],
      },
    },
    include: {
      participants: { select: participantSelect },
    },
  });

  console.info(`[ChatAutomation] Created conversation ${conversation.id} (reason: ${reason})`);

  await sendSystemMessageOnce({ conversationId: conversation.id, type: reason, context });

  return conversation;
};

const resolveMentorMemberPair = (participants: ConversationParticipantInfo[]) => {
  const mentors = participants.filter((participant) => participant.role === Role.MENTOR);
  const members = participants.filter((participant) => participant.role === Role.MEMBER);
  const mentor = mentors[0];
  const member = members[0];
  if (!mentor || !member || mentors.length !== 1 || members.length !== 1) {
    throw new ChatPermissionError("Conversation must include exactly one member and one mentor.");
  }
  return { mentor, member };
};

const ensureMemberMentorPair = async (
  memberId: string,
  mentorId: string,
  cache: AllowedMentorCache,
) => {
  const allowed = await getAllowedMentorsForMember(memberId, cache);
  if (!allowed.has(mentorId)) {
    throw new ChatPermissionError("This mentor is not available for this member.");
  }
};

const ensureUserCanAccessConversation = async (
  user: Actor,
  conversation: {
    participants: ConversationParticipantInfo[];
  },
  cache: AllowedMentorCache = new Map(),
) => {
  if (user.role === Role.ADMIN) return;

  const isParticipant = conversation.participants.some((participant) => participant.id === user.id);
  if (!isParticipant) {
    throw new ChatPermissionError("You are not a participant in this conversation.");
  }

  const { mentor, member } = resolveMentorMemberPair(conversation.participants);
  if (user.role === Role.MEMBER && member.id !== user.id) {
    throw new ChatPermissionError("You are not a participant in this conversation.");
  }
  if (user.role === Role.MENTOR && mentor.id !== user.id) {
    throw new ChatPermissionError("You are not a participant in this conversation.");
  }

  if (!member.mentorId || member.mentorId !== mentor.id) {
    throw new ChatPermissionError("Conversation must align with the assigned mentor.");
  }

  if (user.role === Role.MEMBER) {
    const allowed = await getAllowedMentorsForMember(user.id, cache);
    if (!allowed.has(mentor.id)) {
      throw new ChatPermissionError("You are not allowed to message this mentor.");
    }
    return;
  }

  if (user.role === Role.MENTOR) {
    const allowed = await getAllowedMentorsForMember(member.id, cache);
    if (!allowed.has(user.id)) {
      throw new ChatPermissionError("You cannot join conversations for that member.");
    }
    return;
  }
};

export type ConversationSummary = {
  id: string;
  mentor: ChatParticipant | null;
  member: ChatParticipant | null;
  mentorId: string | null;
  memberId: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastMessageSenderRole: Role | null;
  updatedAt: string;
};

const buildChatParticipant = (participant: ConversationParticipantInfo): ChatParticipant => ({
  id: participant.id,
  name: participant.name ?? null,
  role: participant.role,
});

export async function listUserConversations(user: Actor): Promise<ConversationSummary[]> {
  const conversations = await prisma.conversation.findMany({
    where: user.role === Role.ADMIN ? {} : { participants: { some: { id: user.id } } },
    include: {
      participants: {
        select: participantSelect,
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const cache: AllowedMentorCache = new Map();
  const summaries: ConversationSummary[] = [];

  for (const conversation of conversations) {
    try {
      await ensureUserCanAccessConversation(user, conversation, cache);
    } catch (error) {
      continue;
    }
    // INTENTIONAL: Mentor note snippets will be added when the mentor notes index is available.

    let mentor: ConversationParticipantInfo | null = null;
    let member: ConversationParticipantInfo | null = null;
    try {
      const pair = resolveMentorMemberPair(conversation.participants);
      mentor = pair.mentor;
      member = pair.member;
    } catch {
      continue;
    }
    const lastMessage = conversation.messages[0];
    summaries.push({
      id: conversation.id,
      mentor: mentor ? buildChatParticipant(mentor) : null,
      member: member ? buildChatParticipant(member) : null,
      mentorId: mentor?.id ?? null,
      memberId: member?.id ?? null,
      lastMessage: lastMessage?.content ?? null,
      lastMessageAt: lastMessage?.createdAt ? lastMessage.createdAt.toISOString() : null,
      lastMessageSenderRole: lastMessage?.sender?.role ?? null,
      updatedAt: conversation.updatedAt.toISOString(),
    });
  }

  return summaries;
}

export async function createOrGetConversation(
  memberId: string,
  mentorId: string,
  initiator: Actor,
) {
  const cleanMemberId = memberId.trim();
  const cleanMentorId = mentorId.trim();
  if (!cleanMemberId || !cleanMentorId) {
    throw new ChatPermissionError("Mentor and member IDs are required.");
  }

  if (initiator.role !== Role.ADMIN && ![cleanMemberId, cleanMentorId].includes(initiator.id)) {
    throw new ChatPermissionError("You cannot create conversations for other people.");
  }

  enforceRateLimit(`conversation:create:${initiator.id}`, 3, 60_000);

  const participants = await prisma.user.findMany({
    where: { id: { in: [cleanMemberId, cleanMentorId] } },
    select: participantSelect,
  });

  if (participants.length !== 2) {
    throw new ChatPermissionError("Unable to locate both participants.");
  }

  const member = participants.find((participant) => participant.role === Role.MEMBER);
  const mentor = participants.find((participant) => participant.role === Role.MENTOR);

  if (!member || !mentor) {
    throw new ChatPermissionError("Conversations must include both a member and a mentor.");
  }

  const cache: AllowedMentorCache = new Map();
  if (initiator.role !== Role.ADMIN) {
    await ensureMemberMentorPair(member.id, mentor.id, cache);
  }

  const existing = await findExistingConversation([member.id, mentor.id]);
  if (existing) {
    return existing;
  }

  return prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: member.id }, { id: mentor.id }],
      },
    },
    include: {
      participants: {
        select: participantSelect,
      },
    },
  });
}

export async function getOrCreateConversation(userId: string, participantIds: string[]) {
  const initiator = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!initiator) {
    throw new ChatPermissionError("Initiating user not found.");
  }

  const uniqueIds = Array.from(new Set([...participantIds, userId])).filter(Boolean);
  if (uniqueIds.length !== 2) {
    throw new ChatPermissionError("Conversations must include exactly two participants.");
  }

  const participants = await prisma.user.findMany({
    where: { id: { in: uniqueIds } },
    select: participantSelect,
  });

  const member = participants.find((participant) => participant.role === Role.MEMBER);
  const mentor = participants.find((participant) => participant.role === Role.MENTOR);

  if (!member || !mentor) {
    throw new ChatPermissionError("Conversation must include a member and a mentor.");
  }

  return createOrGetConversation(member.id, mentor.id, initiator);
}

export async function getConversationForUser(
  conversationId: string,
  user: Actor,
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        select: participantSelect,
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!conversation) {
    throw new ChatPermissionError("Conversation not found or access denied.", 404);
  }

  await ensureUserCanAccessConversation(user, conversation);
  return conversation;
}

export async function sendMessage({
  conversationId,
  sender,
  content,
  isSystem = false,
}: {
  conversationId: string;
  sender: ChatActor;
  content: string;
  isSystem?: boolean;
}) {
  if (!content.trim()) {
    throw new ChatPermissionError("Message content cannot be empty.", 400);
  }

  enforceRateLimit(`chat:send:${sender.id}`, 12, 30_000);

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        select: participantSelect,
      },
    },
  });

  if (!conversation) {
    throw new ChatPermissionError("Conversation not found.", 404);
  }

  await ensureUserCanAccessConversation(sender, conversation);

  // INTENTIONAL: Concierge automation is deferred until system note workflows are defined.
  return prisma.conversationMessage.create({
    data: {
      conversationId,
      senderId: sender.id,
      content,
      isSystem,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
}

export async function getMessages(
  conversationId: string,
  user: Actor,
): Promise<ChatMessageDTO[]> {
  const conversation = await getConversationForUser(conversationId, user);
  return conversation.messages.map((message) => toChatMessageDTO(message));
}

export { ChatPermissionError };

export const toChatMessageDTO = (
  message: ConversationMessageWithSender,
): ChatMessageDTO => ({
  id: message.id,
  content: message.content,
  senderId: message.senderId,
  senderName: message.sender?.name ?? null,
  senderRole: message.sender?.role ?? null,
  conversationId: message.conversationId,
  createdAt: message.createdAt,
  readAt: message.readAt ?? null,
  isSystem: message.isSystem,
});
