import { ICreatePost } from "./blog.interface"
import { IUser } from "./user.interface"

export interface IComment {
    _id: string
    text: string
    author: IUser
    blog: string
    createdAt: string
    updatedAt: string
}

export interface CreateCommentModalProps {
    modal: boolean;
    onClose: () => void;
    onSubmit: (text: string) => void;
}