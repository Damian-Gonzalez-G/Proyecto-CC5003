import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { connectDB } from "../config/db";
import { Movie } from "../movies/movie.model";

dotenv.config();

const CANDIDATE_PATHS = [
  path.resolve(process.cwd(), "db.json"),
  path.resolve(process.cwd(), "backend", "db.json"),
  path.resolve(process.cwd(), "backend", "data", "db.json"),
];

function loadDbJson(): any {
  for (const p of CANDIDATE_PATHS) {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      try {
        return JSON.parse(raw);
      } catch (e) {
        throw new Error(`db.json encontrado en ${p} pero no es JSON válido: ${(e as Error).message}`);
      }
    }
  }
  throw new Error(
    `No se encontró db.json en ninguna de estas rutas:\n  - ${CANDIDATE_PATHS.join("\n  - ")}`
  );
}

type SeedMode = "wipe-and-insert" | "upsert";

async function seed(mode: SeedMode = "wipe-and-insert") {
  await connectDB();

  const data = loadDbJson();

  if (!data || !Array.isArray(data.movies)) {
    throw new Error("El archivo db.json debe tener la forma { \"movies\": [...] }");
  }

  const docs = data.movies.map((m: any) => ({
    legacyId: String(m.id ?? ""), 
    title: String(m.title ?? "").trim(),
    director: String(m.director ?? "").trim(),
    year: Number(m.year ?? 0),
    genre: Array.isArray(m.genre) ? m.genre.map(String) : [],
    time: Number(m.time ?? 0),
    cast: Array.isArray(m.cast) ? m.cast.map(String) : [],
    rating: typeof m.rating === "number" ? m.rating : null,
    provider: Array.isArray(m.provider) ? m.provider.map(String) : m.provider ? [String(m.provider)] : [],
  }));

  if (mode === "wipe-and-insert") {
    await Movie.deleteMany({});
    const inserted = await Movie.insertMany(docs, { ordered: false });
    console.log(`Seed completado (wipe-and-insert). Insertadas: ${inserted.length}`);
  } else {
    const ops = docs.map((d: any) => ({
      updateOne: {
        filter: { legacyId: d.legacyId },
        update: { $set: d },
        upsert: true,
      },
    }));
    const result = await Movie.bulkWrite(ops, { ordered: false });
    const upserts = result.upsertedCount ?? 0;
    const modified = result.modifiedCount ?? 0;
    console.log(`Seed completado (upsert). Creadas: ${upserts}, Actualizadas: ${modified}`);
  }

  process.exit(0);
}

const arg = (process.argv[2] || "").toLowerCase();
const mode: SeedMode = arg === "upsert" ? "upsert" : "wipe-and-insert";

seed(mode).catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});