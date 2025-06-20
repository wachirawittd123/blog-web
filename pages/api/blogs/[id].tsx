import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/mongo"
import Blog from "@/models/Blog"
import Comment from "@/models/Comment"
import { checkVerifyToken } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()
  const { id } = req.query

  if (req.method === "GET") {
    try {
      const blog = await Blog.findById(id)
        .populate("author", "username name avatarUrl")
        .populate("category", "name description")

      if (!blog) {
        return res.status(404).json({ status_code: 404, message: "Blog not found" })
      }

      const comments = await Comment.find({ blog: id })
        .populate("author", "username avatarUrl")
        .sort({ createdAt: -1 })

      return res.status(200).json({
        status_code: 200,
        message: "Blog fetched successfully",
        data: {
          ...blog.toObject(),
          comments
        }
      })
    } catch (error: any) {
      return res.status(500).json({ status_code: 500, message: error.message })
    }
  }

  if (req.method === "PUT") {
    const user = await checkVerifyToken({req, res})
    const blog = await Blog.findOne({ _id: id, author: user?.id })
    if(!blog) return res.status(404).json({ status_code: 404, message: "Author not blog" })
    const { title, content } = req.body
    const updated = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    )

    return res.status(200).json({ status_code: 200, message: "Blog updated successfully", data: updated })
  }


  if (req.method === "DELETE") {
    const user = await checkVerifyToken({req, res})
    const blog = await Blog.findOne({ _id: id, author: user?.id })
    if(!blog) return res.status(404).json({ status_code: 404, message: "Author not blog" })
    await Comment.deleteMany({ blog: id })
    await Blog.findByIdAndDelete(id)

    return res.status(200).json({ status_code: 200, message: "Blog and related comments deleted" })
  }

  return res.status(405).json({ status_code: 405, message: "Method Not Allowed" })
}