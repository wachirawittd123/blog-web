// models/User.ts
import mongoose, { Document, Schema, Model } from "mongoose"

export interface IUser extends Document {
  username: string
//   password: string
  name?: string
  avatarUrl?: string
  role: string
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    name: { type: String },
    avatarUrl: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
export default User
