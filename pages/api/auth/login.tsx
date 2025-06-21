import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongo"
import User from "@/models/User"
import { generateToken } from "@/lib/auth"
import { serialize } from "cookie"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { username } = req.body

  if (!username) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  const user = await User.findOne({ username })
  if (!user) return res.status(401).json({ message: "Invalid credentials" })

  await User.findByIdAndUpdate(user._id, { active: true })

//   const match = await bcrypt.compare(password, user.password)
//   if (!match) return res.status(401).json({ message: "Invalid credentials" })

  const token = generateToken(user)

  res.setHeader(
    "Set-Cookie",
    serialize("web-blog-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  )

  return res.status(200).json({ 
    status_code: 200,
    message: "Login successful", 
    token, 
    data: {
        token,
        user: {
            id: user._id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            active: true
        }
    }
   })
}
