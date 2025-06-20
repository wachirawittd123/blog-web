import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/mongo"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import path from "path"
import { parseForm, removeDefaultFile } from "@/lib/file"
import { checkVerifyToken } from "@/lib/auth"

export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB()

    if (req.method === "GET") {
        try {
          await checkVerifyToken({req, res, roles: ["admin"]})
          const { page = "1", limit = "10" } = req.query
      
          const pageNumber = parseInt(page as string, 10)
          const limitNumber = parseInt(limit as string, 10)
      
          const skip = (pageNumber - 1) * limitNumber
      
          const users = await User.find().skip(skip).limit(limitNumber).sort({ createdAt: -1 })
          const total = await User.countDocuments()
      
          return res.status(200).json({
            status_code: 200,
            data: {
                user: users,
                pagination: {
                    total,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(total / limitNumber),
                },
            },
          })
        } catch (error: any) {
          return res.status(500).json({ status_code: 500, message: error.message })
        }
    }
  
    if (req.method === "POST") {
      try {
        // await checkVerifyToken({req, res, roles: ["admin"]})
        const { fields, files } = await parseForm(req, "user")
        const { username, name } = fields
        const avatar = files.avatar?.length > 0 ? files.avatar[0] : undefined
        if(!username || !name) {
            if (avatar && avatar.filepath) await removeDefaultFile(avatar.filepath)
            return res.status(400).json({ status_code: 400, message: "Missing required fields" })
        }
        const findUser = await User.findOne({ username })
        if (findUser) {
            if (avatar && avatar.filepath) await removeDefaultFile(avatar.filepath)
            return res.status(400).json({ status_code: 400, message: "User already exists" })
        }
        // const hashedPassword = await bcrypt.hash(password, 10)
  
        const avatarPath = avatar
          ? `/uploads/user/${path.basename(avatar.filepath)}`
          : ""
  
        const user = await User.create({
          username,
        //   password: hashedPassword,
          name,
          avatarUrl: avatarPath,
        })
  
        return res.status(201).json({ status_code: 201, message: "User created successfully", data: user })
      } catch (error: any) {
        return res.status(500).json({ status_code: 500, message: error?.message })
      }
    }
  
    if (req.method === "GET") {
      await checkVerifyToken({req, res, roles: ["admin"]})
      const users = await User.find()
      return res.status(200).json({ success: true, users })
    }
  
    return res.status(405).json({ message: "Method Not Allowed" })
  }