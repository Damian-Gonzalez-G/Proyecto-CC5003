// src/movies/movie.model.ts
import { Schema, model } from "mongoose";

const movieSchema = new Schema(
  {
    legacyId: { type: String, index: true, unique: false },
    title: { type: String, required: true, trim: true },
    director: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1888 },
    genre: { type: [String], default: [] },
    time: { type: Number, required: true, min: 1 },
    cast: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 10, default: null },
    provider: {
      type: [String],
      default: [],
      set: (val: string | string[]) => (Array.isArray(val) ? val : [val]),
    },
  },
  { timestamps: true }
);

export const Movie = model("Movie", movieSchema);