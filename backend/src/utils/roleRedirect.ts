export const roleRedirect = (role?: string) => {
  const normalizedRole = (role ?? 'MEMBER').toUpperCase();

  switch (normalizedRole) {
    case 'ADMIN':
      return '/dashboard/admin';
    case 'MENTOR':
      return '/mentor/dashboard';
    default:
      return '/dashboard';
  }
};
