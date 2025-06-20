import jwt from "jsonwebtoken"
import { IUser } from "@/models/User"
import { JWT_SECRET } from "./setting";
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie"
import { ICheckVerifyToken, IVerifyToken } from "@/interface";

export const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
}

export const verifyToken = (token: string): { id: string; username: string } => {
  return jwt.verify(token, JWT_SECRET) as IVerifyToken
}

export const checkVerifyToken = async({req, res, roles = ["user"]}: ICheckVerifyToken) => {
    let token: string | undefined = undefined

    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
    }

    if (!token) {
      const cookies = parse(req.headers.cookie || "")
      token = cookies["web-blog-token"]
    }
    try {
        const user: IVerifyToken | any = await verifyToken(token as string)
        if(roles && roles.length > 0 && !roles?.includes(user?.role as string)) {
            return res.status(401).json({ status_code: 401, message: "Role not allowed" })
        }
        return user
    } catch {
        return res.status(401).json({ status_code: 401, valid: false, message: "Invalid token" })
    }
} 
