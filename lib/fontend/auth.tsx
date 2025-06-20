import { IVerifyToken } from "@/interface"
import { parse } from "cookie"
import jwt from "jsonwebtoken"

export const convertToken = (req: any) => {
    const cookies = parse(req.headers.cookie || '')
    const token = cookies['web-blog-token']
    if(!token) return null
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string) as IVerifyToken
        return {
            token,
            user
        }
    } catch {
        return null
    }
}