import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { User } from "../users/user.model";

const router = Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ error: "invalid username or password" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid username or password" });

  const csrf = crypto.randomUUID();
  const payload = { id: user.id, username: user.username, csrf };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN || 3600),
  });

  res.setHeader("X-CSRF-Token", csrf);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", 
    path: "/",
  });

  return res.status(200).json({ id: user.id, username: user.username, name: user.name });
});

router.get("/me", (_req, res) => {
  res.status(200).json({ ok: true });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;