import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/mongo"
import Blog from "@/models/Blog"
import { checkVerifyToken } from "@/lib/auth"
import mongoose from "mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  if (req.method === "GET") {
    try {

      const { page = "1", limit = "10", search = "", category = "", typeQuery = "all", author = "" } = req.query

      const pageNumber = parseInt(page as string, 10)
      const limitNumber = parseInt(limit as string, 10)
      const skip = (pageNumber - 1) * limitNumber

      let where: any = {}

      if (search?.length > 0) {
        where = {
          ...where,
          $or: [
            { title: { $regex: search, $options: "i" } }, 
            { content: { $regex: search, $options: "i" } }
          ]
        }
      }
      if (category?.length > 0 && category !== "all") {
        const categoryId = new mongoose.Types.ObjectId(category as string)
        where.category = categoryId
      }

      if(typeQuery === "private") {
        where.author = new mongoose.Types.ObjectId(author as string)
      }

      const result = await Blog.aggregate([
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blog",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author"
          }
        },
        {
          $unwind: "$author" // Unwind author array
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categories"
          }
        },
        {
          $unwind: "$categories", // Unwind categories array
        },
        {
          $match: where // Apply the filter condition
        },
        {
          $addFields: {
            commentCount: { $size: "$comments" } // Add a field for comment count
          }
        },
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limitNumber }
            ],
            total: [
              { $count: "count" }
            ]
          }
        }
      ])

      const blogs = result[0].data
      const totalCount = result[0].total[0]?.count || 0

      return res.status(200).json({
        status_code: 200,
        message: "Query Blogs Success",
        data: blogs,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNumber)
        }
      })
    } catch (err: any) {
      return res.status(500).json({ status_code: 500, message: err.message })
    }
  }

  if (req.method === "POST") {
    try {
      const user = await checkVerifyToken({ req, res })
      const { title, content, category } = req.body
      if (!title || !content || !category) {
        return res.status(400).json({ status_code: 400, message: "Missing fields" })
      }

      const blog = await Blog.create({ title, content, category, author: user?.id })

      return res.status(200).json({ status_code: 200, message: "Blog Create Success", data: blog })
    } catch (err: any) {
      return res.status(500).json({ status_code: 500, message: err.message })
    }
  }

  return res.status(405).json({ status_code: 405, message: "Method Not Allowed" })
}
