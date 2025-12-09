import type { StoredUser } from "@/lib/auth";

type RedirectInput = Pick<StoredUser, "role">;

export const redirectByRole = (user: RedirectInput) => {
  const normalizedRole = (user.role ?? "MEMBER").toUpperCase();

  switch (normalizedRole) {
    case "ADMIN":
      return "/dashboard/admin";
    case "MENTOR":
      return "/mentor/dashboard";
    default:
      return "/dashboard";
  }
};
