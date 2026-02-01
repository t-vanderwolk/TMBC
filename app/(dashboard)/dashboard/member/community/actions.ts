"use server";

import { revalidatePath } from "next/cache";

import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  createCommunityPost,
  createCommunityReply,
} from "@/lib/services/server/community.service";

const COMMUNITY_PATH = "/dashboard/member/community";

type SafePostPayload = {
  roomId: string;
  content: string;
  anonymous?: boolean;
};

type SafeReplyPayload = {
  postId: string;
  content: string;
};

export async function createCommunityPostAction(payload: SafePostPayload) {
  const user = await getUserOrThrow();

  const post = await createCommunityPost({
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    roomId: payload.roomId,
    content: payload.content,
    isAnonymous: Boolean(payload.anonymous),
  });

  revalidatePath(COMMUNITY_PATH);
  return post;
}

export async function createCommunityReplyAction(payload: SafeReplyPayload) {
  const user = await getUserOrThrow();

  const reply = await createCommunityReply({
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    postId: payload.postId,
    content: payload.content,
  });

  revalidatePath(COMMUNITY_PATH);
  return reply;
}
