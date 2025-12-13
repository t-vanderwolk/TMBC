import { ReactNode } from "react";

import DashboardShell, { type DashboardRole } from "@/components/dashboard/DashboardShell";
import { getUserOrThrow } from "@/lib/auth/getUser";
import { PUBLIC_LOGIN_ROUTE, routeForRole } from "@/lib/auth/routeForRole";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ROLE_SEGMENTS: Record<string, DashboardRole> = {
  member: "MEMBER",
  mentor: "MENTOR",
  admin: "ADMIN",
};

const PATH_HEADERS = [
  "x-invoke-path",
  "x-request-url",
  "x-nextjs-page",
  "x-middleware-next",
  "x-nextjs-pathname",
];

const extractPath = () => {
  const requestHeaders = headers();
  for (const headerName of PATH_HEADERS) {
    const value = requestHeaders.get(headerName);
    if (value) {
      return value;
    }
  }
  return "/";
};

const normalizeRoleValue = (src?: string): DashboardRole => {
  const role = (src ?? "member").toUpperCase();
  if (role === "MENTOR") return "MENTOR";
  if (role === "ADMIN") return "ADMIN";
  return "MEMBER";
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  let user;
  try {
    user = await getUserOrThrow();
  } catch {
    redirect(PUBLIC_LOGIN_ROUTE);
  }

  const role = normalizeRoleValue(user.role);
  const targetPath = routeForRole(role);
  const rawPathValue = extractPath();
  let pathname = rawPathValue;
  if (pathname.includes("://")) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      // ignore invalid URL
    }
  }
  pathname = pathname.split("?")[0];
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1 && segments[0] === "dashboard") {
    redirect(targetPath);
  }

  const targetSegment = segments[1]?.toLowerCase();
  if (targetSegment) {
    const requestedRole = ROLE_SEGMENTS[targetSegment];
    if (requestedRole && requestedRole !== role) {
      redirect(targetPath);
    }
  }

  return (
    <DashboardShell role={role}>
      {children}
    </DashboardShell>
  );
}
