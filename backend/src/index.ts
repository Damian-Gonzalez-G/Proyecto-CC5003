import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import movieRoutes from "./movies/movie.routes";
import usersRouter from "./users/user.controller";   
import authRouter from "./auth/auth.controller";     

import { requestLogger } from "./middlewares/requestLogger";
import { unknownEndpoint } from "./middlewares/unknownEndpoint";
import { errorHandler } from "./middlewares/errorHandler";  
import { withUser } from "./auth/auth";                   

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:4173",
    credentials: true, 
  })
);

app.use(requestLogger);

app.use("/api/users", usersRouter); 
app.use("/api/login", authRouter);  
app.use("/api/movies", movieRoutes);

app.get("/api/secure/ping", withUser, (req, res) => {
  res.json({ ok: true, by: req.userId });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error al iniciar el servidor:", err);
});