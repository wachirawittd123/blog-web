// models/Comment.ts
import mongoose, { Document, Schema, Model } from "mongoose"
import { IUser } from "./User"
import { IBlog } from "./Blog"

export interface IComment extends Document {
  text: string
  blog: IBlog["_id"]
  author: IUser["_id"]
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema)
export default Comment
