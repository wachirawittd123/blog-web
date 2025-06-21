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
    comments: any[]
}

export interface IBlogDetail {
    data: IBlog
    onComment: (text: string) => void
    user: IUser
}

export interface IPostList {
    blogs: IBlog[]
    typeQuery?: string
    onEdit?: (values: IBlog) => void
    onDelete?: (id: string) => void
}

export interface CreatePostModalProps {
    modal: IModalAddBlog;
    onClose: () => void;
    onSubmit: (data: ICreatePost) => void;
    categories: ICategory[];
    isLoading?: boolean;
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
    user?: IUser
    typeQuery?: string
    author?: string
}