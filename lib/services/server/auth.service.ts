import { prisma } from '@/lib/prisma';
import { dashboardForRole } from '@/lib/utils/server/roleRedirect';
import { signToken } from '@/lib/utils/server/jwt';

export const AuthService = {
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const dashboard = dashboardForRole(user.role);

    return {
      success: true,
      user,
      token,
      dashboard,
      redirect: dashboard,
    };
  },
};
