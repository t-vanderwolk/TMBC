import { prisma } from "@/lib/prisma";
import {
  buildMyRegistryCollaboratorInviteUrl,
  type MyRegistryCollaborationGuidance,
} from "@/lib/services/server/myregistry/collaboration.service";

type MentorContact = {
  name: string | null;
  email: string | null;
};

export type RegistryCollaborationState = {
  mentor: MentorContact | null;
  collaboration: {
    requestedAt: string | null;
    confirmedAt: string | null;
    mentorEmail: string | null;
  };
  canCollaborate: boolean;
  guidedInviteUrl: string | null;
  instructions: string[];
};

type MemberCollaborationContext = {
  mentor: MentorContact | null;
  mentorCollabRequestedAt: Date | null;
  mentorCollabConfirmedAt: Date | null;
  mentorCollabEmail: string | null;
  registryId: string | null;
};

const formatState = (
  context: MemberCollaborationContext,
  guidance?: MyRegistryCollaborationGuidance,
): RegistryCollaborationState => ({
  mentor: context.mentor,
  collaboration: {
    requestedAt: context.mentorCollabRequestedAt?.toISOString() ?? null,
    confirmedAt: context.mentorCollabConfirmedAt?.toISOString() ?? null,
    mentorEmail: context.mentorCollabEmail ?? context.mentor?.email ?? null,
  },
  canCollaborate: Boolean(context.mentor?.email),
  guidedInviteUrl: guidance?.guidedInviteUrl ?? null,
  instructions: guidance?.instructions ?? [],
});

const buildGuidance = (context: MemberCollaborationContext) => {
  const mentorEmail = context.mentorCollabEmail ?? context.mentor?.email;
  if (!mentorEmail) return null;
  return buildMyRegistryCollaboratorInviteUrl({
    registryId: context.registryId,
    mentorEmail,
  });
};

const isMissingColumnError = (error: any, column: string) =>
  error?.code === "P2021" &&
  typeof error?.meta?.column_name === "string" &&
  error.meta.column_name === column;

const loadMemberContext = async (userId: string): Promise<MemberCollaborationContext> => {
  let member: {
    mentorCollabRequestedAt: Date | null;
    mentorCollabConfirmedAt: Date | null;
    mentorCollabEmail: string | null;
    mentor: MentorContact | null;
    registry: { myRegistryId: string | null } | null;
  } | null = null;

  try {
    member = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        mentorCollabRequestedAt: true,
        mentorCollabConfirmedAt: true,
        mentorCollabEmail: true,
        mentor: {
          select: { name: true, email: true },
        },
        registry: {
          select: { myRegistryId: true },
        },
      },
    });
  } catch (error) {
    // The registry page should not hard-fail if new collaboration columns are missing in the DB.
    const missingCollabColumn =
      isMissingColumnError(error, "mentorCollabRequestedAt") ||
      isMissingColumnError(error, "mentorCollabConfirmedAt") ||
      isMissingColumnError(error, "mentorCollabEmail");
    if (!missingCollabColumn) {
      throw error;
    }
    const fallback = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        mentor: {
          select: { name: true, email: true },
        },
        registry: {
          select: { myRegistryId: true },
        },
      },
    });
    if (!fallback) {
      member = null;
    } else {
      member = {
        mentorCollabRequestedAt: null,
        mentorCollabConfirmedAt: null,
        mentorCollabEmail: null,
        mentor: fallback.mentor ? { name: fallback.mentor.name ?? null, email: fallback.mentor.email } : null,
        registry: fallback.registry ? { myRegistryId: fallback.registry.myRegistryId } : null,
      };
    }
  }

  if (!member) {
    throw new Error("User not found");
  }

  return {
    mentor: member.mentor ? { name: member.mentor.name ?? null, email: member.mentor.email } : null,
    mentorCollabRequestedAt: member.mentorCollabRequestedAt,
    mentorCollabConfirmedAt: member.mentorCollabConfirmedAt,
    mentorCollabEmail: member.mentorCollabEmail,
    registryId: member.registry?.myRegistryId ?? null,
  };
};

export const getRegistryCollaborationState = async (userId: string) => {
  const context = await loadMemberContext(userId);
  const guidance = buildGuidance(context);
  return formatState(context, guidance ?? undefined);
};

export const requestRegistryCollaboration = async (userId: string) => {
  const context = await loadMemberContext(userId);
  if (context.mentorCollabRequestedAt) {
    const guidance = buildGuidance(context);
    return formatState(context, guidance ?? undefined);
  }

  const mentorEmail = context.mentor?.email;
  if (!mentorEmail) {
    throw new Error("Mentor not assigned");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      mentorCollabRequestedAt: new Date(),
      mentorCollabEmail: mentorEmail,
    },
    select: {
      mentorCollabRequestedAt: true,
      mentorCollabConfirmedAt: true,
      mentorCollabEmail: true,
      mentor: {
        select: { name: true, email: true },
      },
      registry: {
        select: { myRegistryId: true },
      },
    },
  });

  const nextContext: MemberCollaborationContext = {
    mentor: updated.mentor ? { name: updated.mentor.name ?? null, email: updated.mentor.email } : null,
    mentorCollabRequestedAt: updated.mentorCollabRequestedAt,
    mentorCollabConfirmedAt: updated.mentorCollabConfirmedAt,
    mentorCollabEmail: updated.mentorCollabEmail,
    registryId: updated.registry?.myRegistryId ?? null,
  };

  const guidance = buildGuidance(nextContext);
  return formatState(nextContext, guidance ?? undefined);
};

export const confirmRegistryCollaboration = async (userId: string) => {
  const context = await loadMemberContext(userId);
  if (context.mentorCollabConfirmedAt) {
    const guidance = buildGuidance(context);
    return formatState(context, guidance ?? undefined);
  }

  const mentorEmail = context.mentorCollabEmail ?? context.mentor?.email;
  if (!mentorEmail) {
    throw new Error("Mentor not assigned");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      // TODO: Replace this soft-confirm flag with verified MyRegistry collaborator status when available.
      mentorCollabConfirmedAt: new Date(),
      mentorCollabRequestedAt: context.mentorCollabRequestedAt ?? new Date(),
      mentorCollabEmail: context.mentorCollabEmail ?? mentorEmail,
    },
    select: {
      mentorCollabRequestedAt: true,
      mentorCollabConfirmedAt: true,
      mentorCollabEmail: true,
      mentor: {
        select: { name: true, email: true },
      },
      registry: {
        select: { myRegistryId: true },
      },
    },
  });

  const nextContext: MemberCollaborationContext = {
    mentor: updated.mentor ? { name: updated.mentor.name ?? null, email: updated.mentor.email } : null,
    mentorCollabRequestedAt: updated.mentorCollabRequestedAt,
    mentorCollabConfirmedAt: updated.mentorCollabConfirmedAt,
    mentorCollabEmail: updated.mentorCollabEmail,
    registryId: updated.registry?.myRegistryId ?? null,
  };

  const guidance = buildGuidance(nextContext);
  return formatState(nextContext, guidance ?? undefined);
};
