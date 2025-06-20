import type { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "cookie"
import { checkVerifyToken } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await checkVerifyToken({req, res})
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      })
    )
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error: any) {
    return res.status(500).json({ status_code: 500, message: error.message })
  }
}
