import { Role } from "@prisma/client";

export function routeAfterLogin(role: Role) {
  switch (role) {
    case Role.ADMIN:
      return "/dashboard/admin";
    case Role.MENTOR:
      return "/dashboard/mentor";
    case Role.MEMBER:
      return "/dashboard/member";
    default:
      return "/dashboard";
  }
}
