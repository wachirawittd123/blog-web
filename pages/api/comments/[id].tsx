import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/mongo"
import Comment from "@/models/Comment"
import { checkVerifyToken } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()
  const { id } = req.query

  if (req.method === "GET") {
    const comment = await Comment.findById(id).populate("author", "username avatarUrl")

    if (!comment) {
      return res.status(404).json({ status_code: 404, message: "Comment not found" })
    }

    return res.status(200).json({ status_code: 200, data: comment })
  }

  if (req.method === "PUT") {
    try {
      const user = await checkVerifyToken({req, res})
      const { text } = req.body

      if (!text) {
        return res.status(400).json({ success: false, message: "Text is required" })
      }
      const comment = await Comment.findOne({ _id: id, author: user?.id })
      if (!comment) return res.status(404).json({ status_code: 404, message: "Author not comment" })

      const updated = await Comment.findByIdAndUpdate(
        id,
        { text },
        { new: true }
      ).populate("author", "username avatarUrl")

      if (!updated) {
        return res.status(404).json({ status_code: 404, message: "Comment not found" })
      }

      return res.status(200).json({ status_code: 200, message: "Comment updated", data: updated })
    } catch (err: any) {
      return res.status(500).json({ status_code: 500, message: err.message })
    }
  }

  if (req.method === "DELETE") {
    const deleted = await Comment.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ status_code: 404, message: "Comment not found" })
    }

    return res.status(200).json({ status_code: 200, message: "Comment deleted" })
  }

  return res.status(405).json({ status_code: 405, message: "Method Not Allowed" })
}