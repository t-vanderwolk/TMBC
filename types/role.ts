export enum Role {
  MEMBER = 'MEMBER',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN',
}

export const ALL_ROLES: Role[] = [Role.MEMBER, Role.MENTOR, Role.ADMIN];

export const isRole = (value?: string | null): value is Role => {
  if (!value) return false;
  return ALL_ROLES.includes(value as Role);
};

export const normalizeRole = (role?: string | null): Role => {
  if (!role) return Role.MEMBER;
  const normalized = role.toUpperCase();
  if (isRole(normalized)) return normalized;
  return Role.MEMBER;
};
