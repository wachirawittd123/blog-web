import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/mongo"
import Category from "@/models/Category"
import Blog from "@/models/Blog"
import { checkVerifyToken } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()
  const { id } = req.query

  if (req.method === "GET") {
    const category = await Category.findById(id)
    if (!category) return res.status(404).json({ status_code: 404, message: "Not found" })
    return res.status(200).json({ status_code: 200, message: "Query Category Success", data: category })
  }

  if (req.method === "PUT") {
    try {
      await checkVerifyToken({req, res})
      const { name, description } = req.body
      if (!name) {
        return res.status(400).json({ status_code: 400, message: "Name is required" })
      }

      const updated = await Category.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }
      )

      if (!updated) {
        return res.status(404).json({ status_code: 404, message: "Category not found" })
      }

      return res.status(200).json({ status_code: 200, message: "Category updated", data: updated })
    } catch (error: any) {
      return res.status(500).json({ status_code: 500, message: error.message })
    }
  }

  if (req.method === "DELETE") {
    await checkVerifyToken({req, res})
    const category = await Blog.findOne({ category: id })
    if (category) return res.status(400).json({ status_code: 400, message: "Category has blogs" })
    const deleted = await Category.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ status_code: 404, message: "Not found" })

    return res.status(200).json({ status_code: 200, message: "Category deleted" })
  }

  return res.status(405).json({ status_code: 405, message: "Method Not Allowed" })
}