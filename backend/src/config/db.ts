import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("No se ha definido MONGODB_URI en el archivo .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); 
  }
}