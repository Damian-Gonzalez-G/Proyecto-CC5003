import { Router } from "express";
import bcrypt from "bcrypt";
import { User } from "./user.model";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "password must be at least 6 chars" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, name, passwordHash });
    const saved = await user.save();
    return res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

export default router;