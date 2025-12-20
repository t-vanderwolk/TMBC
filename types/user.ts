import { Role } from './role';

export type PublicUser = {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  role: Role;
};

export type SafeUser = PublicUser & {
  onboardingComplete?: boolean;
  profileCompleted?: boolean;
  inviteCodeUsed?: boolean;
  token?: string;
};
