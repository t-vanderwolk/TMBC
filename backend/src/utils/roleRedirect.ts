export function dashboardForRole(role?: string) {
  const r = (role || "").toUpperCase();

  if (r === "ADMIN") return "/dashboard/admin";
  if (r === "MENTOR") return "/dashboard/mentor";

  return "/dashboard"; // member fallback
}
