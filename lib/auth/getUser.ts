"use server";

import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { type User } from "@prisma/client";
import { verifyToken } from "@/lib/utils/server/jwt";

type RequestLike = NextRequest | Request | undefined;

const hasCookies = (value: RequestLike): value is NextRequest => {
  return typeof value === "object" && value !== null && "cookies" in value;
};

const COOKIE_NAMES = ["tm_token", "tmbc_token"];

const extractToken = (request?: RequestLike) => {
  const headerToken =
    request?.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    headers().get("authorization")?.replace(/^Bearer\s+/i, "");

  if (headerToken) {
    return headerToken;
  }

  const cookieSource = hasCookies(request) ? request.cookies : cookies();
  for (const name of COOKIE_NAMES) {
    const value = cookieSource.get(name)?.value;
    if (value) {
      return value;
    }
  }

  return null;
};

type SafeUser = Omit<User, "password">;

export async function getUserOrThrow(request?: RequestLike): Promise<SafeUser> {
  const token = extractToken(request);
  if (!token) {
    throw new Error("Unauthorized");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new Error("Unauthorized");
  }

  const subject = payload?.id;
  if (!subject) {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.user.findUnique({
    where: { id: String(subject) },
  });

  if (!profile) {
    throw new Error("User not registered in TMBC database");
  }

  const { password, ...safeProfile } = profile;
  return safeProfile;
}
