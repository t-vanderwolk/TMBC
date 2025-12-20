import type { StoredUser } from "@/lib/auth";

/**
 * Updated redirect logic:
 * - Only send users to onboarding if:
 *     1. They have actually redeemed an invite code, AND
 *     2. They have not finished profile setup.
 *
 * - Seeded users (member@me.com, mentor@me.com, admin@me.com) skip onboarding.
 */

type RedirectInput = Pick<
  StoredUser,
  "role" | "profileCompleted" | "inviteCodeUsed"
>;

export const redirectByRole = (user: RedirectInput) => {
  const normalizedRole = (user.role ?? "MEMBER").toUpperCase();

  // ⭐ Only route to onboarding if invite was redeemed AND profile is incomplete.
  const needsOnboarding =
    Boolean(user.inviteCodeUsed) && user.profileCompleted === false;

  if (needsOnboarding) {
    return "/onboarding";
  }

  // ⭐ Role-based routing
  switch (normalizedRole) {
    case "ADMIN":
      return "/dashboard/admin";
    case "MENTOR":
      return "/mentor/dashboard";
    default:
      return "/dashboard";
  }
};
