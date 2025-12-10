export const redirectByRole = (role?: string) => {
  const normalized = (role ?? "MEMBER").toUpperCase();
  switch (normalized) {
    case "ADMIN":
      return "/dashboard/admin";
    case "MENTOR":
      return "/dashboard/mentor";
    default:
      return "/dashboard/member";
  }
};
