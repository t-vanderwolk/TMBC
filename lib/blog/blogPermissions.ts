import { BlogStatus, type BlogPost } from "@prisma/client";

import type { SafeUser } from "@/lib/auth/getUser";

const mentorEditableStatuses: BlogStatus[] = [BlogStatus.DRAFT, BlogStatus.IN_REVIEW];

export function canEditBlog(user: SafeUser, post: BlogPost) {
  if (user.role === "ADMIN") {
    return true;
  }
  if (user.role === "MENTOR") {
    return post.authorId === user.id && mentorEditableStatuses.includes(post.status);
  }
  return false;
}

export function canSubmitForReview(user: SafeUser, post: BlogPost) {
  return user.role === "MENTOR" && post.authorId === user.id && post.status === BlogStatus.DRAFT;
}

export function canPublish(user: SafeUser) {
  return user.role === "ADMIN";
}
