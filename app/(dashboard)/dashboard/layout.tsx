export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ReactNode } from "react";

import DashboardLayout, { SectionLayout, type DashboardRole } from "@/components/dashboard/DashboardLayout";
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
  // TMBC UX Canon:
  // Mobile-first. Calm. Contextual navigation.
  // No top navbar; navigation lives in the hub or local section header.
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

  const hubPath = routeForRole(role);
  const isHubPath = primaryPath === hubPath;

  return (
    <DashboardLayout>
      {isHubPath ? children : <SectionLayout>{children}</SectionLayout>}
    </DashboardLayout>
  );
}
