import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import movieRoutes from "./movies/movie.routes";
import { requestLogger } from "./middlewares/requestLogger";
import { unknownEndpoint } from "./middlewares/unknownEndpoint";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:4173", credentials: true }));
app.use(requestLogger);

app.use("/api/movies", movieRoutes);

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