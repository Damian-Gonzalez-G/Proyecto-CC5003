import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const bodyPreview = Object.keys(req.body || {}).length ? ` body=${JSON.stringify(req.body)}` : "";
  console.log(`${req.method} ${req.path}${bodyPreview}`);
  next();
}