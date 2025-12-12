export type UserRole = 'MEMBER' | 'MENTOR' | 'ADMIN';

export interface DevUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  title: string;
}

const devUsers: DevUser[] = [
  {
    id: 'user-member',
    email: 'member@me.com',
    name: 'Taylor Member',
    role: 'MEMBER',
    password: 'member123',
    title: 'Expecting Parent',
  },
  {
    id: 'user-mentor',
    email: 'mentor@me.com',
    name: 'Taylor Mentor',
    role: 'MENTOR',
    password: 'mentor123',
    title: 'Mentor',
  },
  {
    id: 'user-admin',
    email: 'admin@me.com',
    name: 'Taylor Admin',
    role: 'ADMIN',
    password: 'admin123',
    title: 'Community Lead',
  },
];

export const getDevUsers = () => devUsers;

export const findDevUser = (email: string, password: string) => {
  return devUsers.find((user) => user.email === email && user.password === password) || null;
};

export const buildSessionToken = (user: DevUser) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    title: user.title,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const parseSessionToken = (token: string) => {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role as UserRole,
      title: parsed.title,
    };
  } catch {
    return null;
  }
};

export const sanitizeUser = (user: DevUser) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  title: user.title,
});
