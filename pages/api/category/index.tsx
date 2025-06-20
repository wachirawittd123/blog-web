import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/mongo"
import Category from "@/models/Category"
import { checkVerifyToken } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  if (req.method === "GET") {
    const categories = await Category.find().sort({ createdAt: -1 })
    return res.status(200).json({ status_code: 200, message: "Query Category Success", data: categories })
  }

  if (req.method === "POST") {
    try {
      await checkVerifyToken({req, res})
      const { name, description } = req.body
      if (!name) {
        return res.status(400).json({ status_code: 400, message: "Name is required" })
      }

      const category = await Category.create({ name, description })
      return res.status(200).json({ status_code: 200, message: "Create Category Success", data: category })
    } catch (error: any) {
      return res.status(500).json({ status_code: 500, message: error.message })
    }
  }

  return res.status(405).json({ status_code: 405, message: "Method Not Allowed" })
}