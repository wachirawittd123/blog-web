import { IComment } from "@/models/Comment"
import { ICategory } from "./category.interface"
import { IUser } from "./user.interface"
import { IVerifyToken } from "./auth.interface"

export interface ISearchBlog {
    query?: string
    category?: string
}

export interface IHeaderBlog {
    search: ISearchBlog
    onChange: (e: React.ChangeEvent<HTMLInputElement> | any, key: string) => void
    onAdd: () => void
    categories: ICategory[]
}

export interface IBlog {
    _id: string
    title: string
    content: string
    commentCount: number
    category: string
    createdAt: Date
    updatedAt: Date
    categories: ICategory
    author: IUser
    comments: IComment[]
}

export interface IPostList {
    blogs: IBlog[]
}

export interface ICreatePost {
    title: string
    content: string
    category: string
}

export interface IModalAddBlog {
    visible: boolean
    data: IBlog | null
}


export interface IFunctionBlog {
    user?: IVerifyToken
    typeQuery?: string
    author?: string
}