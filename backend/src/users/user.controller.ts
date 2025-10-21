import { Router } from "express";
import bcrypt from "bcrypt";
import { User } from "./user.model";
import { withUser } from "../auth/auth"

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
    const anyErr = err as any;
    if (anyErr?.code === 11000) {
      return res.status(409).json({ error: "username already exists" });
    }

    next(err);
  }
});

router.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

router.put("/:id/favorites", withUser, async (req, res, next) => {
  try {
    const { movieId } = req.body
    const userId = req.params.id

    if (req.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const favoriteIndex = user.favorites.indexOf(movieId)
    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1)
    } else {
      user.favorites.push(movieId)
    }

    user.markModified("favorites");

    await user.save()
    return res.json(user)
  } catch (err) {
    next(err)
  }
})

router.put("/:id/watchlist", withUser, async (req, res, next) => {
  try {
    const { movieId } = req.body
    const userId = req.params.id

    if (req.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const watchlistIndex = user.watchlist.indexOf(movieId)
    if (watchlistIndex > -1) {
      user.watchlist.splice(watchlistIndex, 1)
    } else {
      user.watchlist.push(movieId)
    }

    user.markModified("watchlist");

    await user.save()
    return res.json(user)
  } catch (err) {
    next(err)
  }
})

export default router;