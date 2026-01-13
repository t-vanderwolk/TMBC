"use server";

import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { type User } from "@prisma/client";
import { verifyToken } from "@/lib/utils/server/jwt";
import { AUTH_COOKIE_NAMES } from "@/lib/utils/server/authCookies";

type RequestLike = NextRequest | Request | undefined;

const hasCookies = (value: RequestLike): value is NextRequest => {
  return typeof value === "object" && value !== null && "cookies" in value;
};

const COOKIE_NAMES = AUTH_COOKIE_NAMES;
const AUTH_DEBUG = process.env.AUTH_DEBUG === "true";

const extractToken = (request?: RequestLike) => {
  const headerToken =
    request?.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    headers().get("authorization")?.replace(/^Bearer\s+/i, "");

  const requestHost = request?.headers.get("host") ?? headers().get("host");

  if (headerToken) {
    if (AUTH_DEBUG) {
      console.log("AUTH_DEBUG getUser token lookup", {
        source: "header",
        requestHost,
        hasAuthorization: true,
      });
    }
    return headerToken;
  }

  const cookieSource = hasCookies(request) ? request.cookies : cookies();
  const cookiePresence = COOKIE_NAMES.map((name) => ({
    name,
    present: Boolean(cookieSource.get(name)?.value),
  }));

  for (const name of COOKIE_NAMES) {
    const value = cookieSource.get(name)?.value;
    if (value) {
      if (AUTH_DEBUG) {
        console.log("AUTH_DEBUG getUser token lookup", {
          source: "cookie",
          requestHost,
          selectedCookie: name,
          cookiePresence,
        });
      }
      return value;
    }
  }

  return null;
};

export type SafeUser = Omit<User, "password">;

export async function getUserOrThrow(request?: RequestLike): Promise<SafeUser> {
  const token = extractToken(request);
  if (!token) {
    if (AUTH_DEBUG) {
      console.log("AUTH_DEBUG getUser unauthorized - missing token", {
        requestHost: request?.headers.get("host") ?? headers().get("host"),
        hasAuthorizationHeader:
          Boolean(request?.headers.get("authorization")) ||
          Boolean(headers().get("authorization")),
      });
    }
    throw new Error("Unauthorized");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    if (AUTH_DEBUG) {
      console.log("AUTH_DEBUG getUser unauthorized - verify failed", {
        requestHost: request?.headers.get("host") ?? headers().get("host"),
      });
    }
    throw new Error("Unauthorized");
  }

  const subject = payload?.id;
  if (!subject) {
    if (AUTH_DEBUG) {
      console.log("AUTH_DEBUG getUser unauthorized - missing subject", {
        requestHost: request?.headers.get("host") ?? headers().get("host"),
      });
    }
    throw new Error("Unauthorized");
  }

  const profile = await prisma.user.findUnique({
    where: { id: String(subject) },
  });

  if (!profile) {
    if (AUTH_DEBUG) {
      console.log("AUTH_DEBUG getUser unauthorized - profile missing", {
        requestHost: request?.headers.get("host") ?? headers().get("host"),
        userId: subject,
      });
    }
    throw new Error("User not registered in TMBC database");
  }

  const { password, ...safeProfile } = profile;
  if (AUTH_DEBUG) {
    console.log("AUTH_DEBUG getUser success", {
      requestHost: request?.headers.get("host") ?? headers().get("host"),
      userId: safeProfile.id,
      role: safeProfile.role,
    });
  }
  return safeProfile;
}
