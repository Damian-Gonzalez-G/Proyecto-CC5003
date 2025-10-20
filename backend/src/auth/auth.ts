import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const withUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const csrfHeader = req.headers["x-csrf-token"];

    if (typeof decoded === "object" && (decoded as any).id && (decoded as any).csrf && (decoded as any).csrf === csrfHeader) {
      req.userId = (decoded as any).id;
      return next();
    }
    return res.status(401).json({ error: "invalid token" });
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "token expired" });
    }
    return res.status(401).json({ error: "invalid token" });
  }
};