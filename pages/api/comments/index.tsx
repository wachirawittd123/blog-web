import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/mongo"
import Comment from "@/models/Comment"
import { checkVerifyToken } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  if (req.method === "GET") {
    const { blogId } = req.query
    const user = await checkVerifyToken({req, res})
    const filter = blogId ? { blog: blogId } : {}
    const findCommentByAuthor = await Comment.find({...filter, author: user?.id })
    if(!findCommentByAuthor) return res.status(404).json({ status_code: 404, message: "Author not comment" })
    const comments = await Comment.find(filter)
      .populate("author", "username avatarUrl")
      .sort({ createdAt: -1 })

    return res.status(200).json({ status_code: 200, data: comments })
  }

  if (req.method === "POST") {
    try {
      const user = await checkVerifyToken({req, res})
      const { text, blog } = req.body

      if (!text || !blog) {
        return res.status(400).json({ status_code: 400, message: "Missing fields" })
      }

      const comment = await Comment.create({ text, blog, author: user?.id })

      return res.status(200).json({ status_code: 200, message: "Comment created", data: comment })
    } catch (err: any) {
      return res.status(500).json({ status_code: 500, message: err.message })
    }
  }

  return res.status(405).json({ status_code: 405, message: "Method Not Allowed" })
}