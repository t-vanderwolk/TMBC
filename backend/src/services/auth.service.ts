import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { dashboardForRole } from "../utils/roleRedirect";

const prisma = new PrismaClient();

export const AuthService = {
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

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

    return {
      success: true,
      user,
      token,
      dashboard,
      redirect: dashboard
    };
  }
};
