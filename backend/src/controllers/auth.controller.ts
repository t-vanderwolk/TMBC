import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export async function login(req: Request, res: Response) {
  try {
    const result = await AuthService.loginUser(req.body.email, req.body.password);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
