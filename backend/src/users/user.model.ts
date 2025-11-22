import mongoose from "mongoose";

export interface IUser {
  id: string
  username: string
  name?: string
  passwordHash: string
  favorites: string[]
  watchlist: string[]
};

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    name: String,
    passwordHash: { type: String, required: true },
    favorites: { type: [String], default: [] },
    watchlist: { type: [String], default: [] },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_doc, ret: { _id?: mongoose.Types.ObjectId; __v?: number; passwordHash?: string; id?: string }) => {
    if (ret._id) {
      ret.id = ret._id.toString()
    }
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  },
});

export const User = mongoose.model("User", userSchema);