import { ReactNode } from "react"
import { ICategory } from "./category.interface"
import { ISearchBlog } from "./blog.interface"

export interface IResponseAPI  {
    status_code: number
    message: string
    data: any
}

export interface LayoutProps {
    children: ReactNode
}

export interface ISelectComponent  {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement> | any, key: string) => void
    options: ICategory[]
    width?: string
}

export interface IQuery {
    search?: string
    limit?: number
    page?: number
    category?: string
}

export interface IModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    showCloseButton?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    className?: string
}

export interface ICreatePostData {
    title: string
    content: string
    category: string
}