// models/Blog.ts
import mongoose, { Document, Schema, Model } from "mongoose"
import { IUser } from "./User"
import { ICategory } from "./Category"

export interface IBlog extends Document {
  title: string
  content: string
  category: ICategory["_id"]
  author: IUser["_id"]
  commentCount: number
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema)
export default Blog
