export const PUBLIC_LOGIN_ROUTE = "/login";

const normalizeRole = (value?: string) => (value ?? "").toLowerCase();

export function routeForRole(role?: string) {
  switch (normalizeRole(role)) {
    case "member":
      return "/dashboard/member";
    case "mentor":
      return "/dashboard/mentor";
    case "admin":
      return "/dashboard/admin";
    default:
      return PUBLIC_LOGIN_ROUTE;
  }
}
