import { ReactNode } from "react";

import DashboardShell, { type DashboardRole } from "@/components/dashboard/DashboardLayout";
import { getUserOrThrow } from "@/lib/auth/getUser";
import { PUBLIC_LOGIN_ROUTE, routeForRole } from "@/lib/auth/routeForRole";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ROLE_SEGMENTS: Record<string, DashboardRole> = {
  member: "member",
  mentor: "mentor",
  admin: "admin",
};

const PATH_HEADERS = [
  "x-invoke-path",
  "x-request-url",
  "x-nextjs-page",
  "x-middleware-next",
  "x-nextjs-pathname",
];

const extractPath = (): string => {
  const requestHeaders = headers();
  for (const headerName of PATH_HEADERS) {
    const value = requestHeaders.get(headerName);
    if (typeof value === "string" && value.length) {
      return value;
    }
  }
  return "/";
};

const normalizeRoleValue = (src?: string): DashboardRole => {
  const role = (src ?? "member").toLowerCase();
  if (role === "mentor") return "mentor";
  if (role === "admin") return "admin";
  return "member";
};

export default async function DashboardAppLayout({ children }: { children: ReactNode }) {
  // Keep this layout name distinct from the client-side DashboardShell to avoid naming conflicts.
  // TMBC UX Canon:
  // Mobile-first. Calm. Contextual navigation.
  // No top navbar.
  let user;
  try {
    user = await getUserOrThrow();
  } catch {
    redirect(PUBLIC_LOGIN_ROUTE);
  }

  const role = normalizeRoleValue(user.role);
  if (role === "member" && !user.onboardingComplete) {
    redirect("/onboarding/questionnaire");
  }
  const targetPath = routeForRole(role);
  const rawPathValue = extractPath();
  let pathname: string = rawPathValue ?? "/";
  if (pathname.includes("://")) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      // ignore invalid URL
    }
  }
  const [primaryPath] = pathname.split("?");
  pathname = primaryPath ?? pathname;
  const segments = pathname.split("/").filter(Boolean);

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
