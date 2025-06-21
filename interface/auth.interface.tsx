import { NextApiRequest, NextApiResponse } from "next"
import { ICategory } from "./category.interface"
import { IUser } from "./user.interface"

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
    user?: IUser
    categories?: ICategory[]
}

export interface IConvertToken {
    token: string
    user: IVerifyToken
}