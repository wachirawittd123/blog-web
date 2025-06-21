import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/mongo"
import User from "@/models/User"
import { parseForm, removeDefaultFile, removeFile } from "@/lib/file"
import path from "path"
import { checkVerifyToken } from "@/lib/auth"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()
  const { id } = req.query;
  if (req.method === "GET") {
    try {

      await checkVerifyToken({req, res, roles: ["admin", "user"]})
      if (!id) {
        return res.status(400).json({ status_code: 400, message: "Missing user ID" })
      }
      const user = await User.findOne({_id: id})
      if (!user) {
        return res.status(404).json({ status_code: 404, message: "User not found" })
      }
      return res.status(200).json({ status_code: 200, data: user })
    } catch (error: any) {
      return res.status(500).json({ status_code: 500, message: error?.message })
    }
  }

  if (req.method === "PUT") {
    try {
      await checkVerifyToken({req, res, roles: ["admin"]})
      const { fields, files } = await parseForm(req, "user")
      const newName = String(fields.name || "")
      const avatar = files.avatar?.length > 0 ? files.avatar[0] : undefined

      if (!id || !newName) {
        if(avatar?.filepath) await removeDefaultFile(avatar?.filepath)
        return res.status(400).json({ status_code: 400, message: "Missing required fields" })
      }

      const user = await User.findById(id)
      if (!user) {
        if(avatar?.filepath) await removeDefaultFile(avatar?.filepath)
        return res.status(404).json({ status_code: 404, message: "User not found" })
      }

      const newAvatarPath = await removeFile(user.avatarUrl as string, avatar.filepath, "/uploads/user")
      
      user.name = newName
      user.avatarUrl = newAvatarPath
      await user.save()

      return res.status(200).json({ status_code: 200, message: "User updated successfully", data: user })
    } catch (error: any) {
      console.error("Update Error:", error)
      return res.status(500).json({ status_code: 500, message: error?.message })
    }
  }

  if (req.method === "DELETE") {
    try {
      await checkVerifyToken({req, res, roles: ["admin"]})
      if (!id) {
        return res.status(400).json({ status_code: 400, message: "Missing user ID" })
      }
  
      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ status_code: 404, message: "User not found" })
      }
  
      // ✅ ลบ user จาก DB
      await User.findByIdAndDelete(id)

      if (user.avatarUrl) await removeDefaultFile(path.join(process.cwd(), "public",user.avatarUrl))
  
      return res.status(200).json({ status_code: 200, message: "User deleted successfully" })
    } catch (error: any) {
      return res.status(500).json({ status_code: 500, message: error.message })
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}
