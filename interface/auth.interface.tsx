import { NextApiRequest, NextApiResponse } from "next"
import { ICategory } from "./category.interface"

export interface IVerifyToken {
    id: string
    username: string
    role: string
}


export interface ICheckVerifyToken {
    res: NextApiResponse
    req: NextApiRequest
    roles?: string[]
}

export interface IGetServerSideProps {
    token?: string
    user?: IVerifyToken
    categories?: ICategory[]
}