import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { dashboardForRole } from "../utils/roleRedirect";
import { verifyPassword } from "../utils/password";

const prisma = new PrismaClient();

export const AuthService = {
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const matches = await verifyPassword(password, user.password);
    if (!matches) throw new Error("Invalid credentials");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const dashboard = dashboardForRole(user.role);

    const { password: _password, ...safeUser } = user;
    return {
      success: true,
      user: safeUser,
      token,
      dashboard,
      redirect: dashboard
    };
  }
};
