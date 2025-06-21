import type { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "cookie"
import { checkVerifyToken } from "@/lib/auth"
import User from "@/models/User"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await checkVerifyToken({req, res})
    await User.findByIdAndUpdate(user.id, { active: false })
    res.setHeader(
      "Set-Cookie",
      serialize("web-blog-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      })
    )
    return res.status(200).json({ status_code: 200, message: "Logged out successfully" })
  } catch (error: any) {
    return res.status(500).json({ status_code: 500, message: error.message })
  }
}
