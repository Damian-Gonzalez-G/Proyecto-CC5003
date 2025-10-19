import { Request, Response, NextFunction } from "express";
import { Movie } from "./movie.model";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, provider } = req.query as { q?: string; provider?: string };
    const criteria: Record<string, any> = {};

    if (q) {
      criteria.title = { $regex: q, $options: "i" };
    }
    if (provider) {
      criteria.provider = provider; 
    }

    const movies = await Movie.find(criteria).sort({ year: -1 });
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "movie not found" });
    res.status(200).json(movie);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, 
    });
    if (!movie) return res.status(404).json({ error: "movie not found" });
    res.status(200).json(movie);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "movie not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}