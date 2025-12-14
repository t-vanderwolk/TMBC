import { prisma } from '@/lib/prisma';
import { dashboardForRole } from '@/lib/utils/server/roleRedirect';
import { signToken } from '@/lib/utils/server/jwt';
import { verifyPassword } from '@/lib/utils/server/password';

export const AuthService = {
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const matches = await verifyPassword(password, user.password);
    if (!matches) throw new Error('Invalid credentials');

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const dashboard = dashboardForRole(user.role);

    const { password: _password, ...safeUser } = user;
    return {
      success: true,
      user: safeUser,
      token,
      dashboard,
      redirect: dashboard,
    };
  },
};
