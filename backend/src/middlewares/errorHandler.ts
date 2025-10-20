import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err.name, err.message);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }

  res.status(500).json({ error: "internal server error" });
}