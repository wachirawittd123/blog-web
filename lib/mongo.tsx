import mongoose from "mongoose"
import { MONGODB_URI } from "./setting"


export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) return mongoose
  return mongoose.connect(MONGODB_URI)
}
