import { IBlogDetail, ICategory, IComment } from '@/interface';
import React, { useState } from 'react';
import { BackArrowIcon, CommentIcon, UserAvatar } from '../Icon';
import moment from 'moment';
import router from 'next/router';
import { getWindowWidth } from '@/lib/fontend/get-width-window';
import { CreateCommentModal } from './create-comment-modal';
import toast from 'react-hot-toast';


const BlogDetail: React.FC<IBlogDetail> = ({ data, onComment, user }) => {
  const { windowWidth } = getWindowWidth()
  const [modal, setModal] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")

  const onCancel = () => {
    setComment("")
  }

  const onSubmit = async(value: string) => {
    await onComment(value)
    setModal(false)
    setComment("")
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      <div className="mb-6">
        <button className="w-12 h-12 bg-[#D8E9E4] rounded-full flex items-center justify-center hover:bg-opacity-80 cursor-pointer" onClick={() => router.back()}>
          <BackArrowIcon />
        </button>
      </div>

      <div className="flex items-center mb-4 mt-10">
        <div className="relative w-12 h-12 mr-4">
          <img
            className="w-12 h-12 rounded-full"
            src={data?.author?.avatarUrl}
            alt="author-avatar"
          />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              data?.author?.active ? 'bg-green-500' : 'bg-gray-400'
            }`}
          ></div>
        </div>
        <div className="flex items-center">
          <p className="font-semibold text-gray-800 mr-2">{data?.author?.name}</p>
          <p className="text-sm text-gray-500">
            {data?.updatedAt ? moment(data?.updatedAt).fromNow() : '5mo. ago'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{(data?.category as unknown as ICategory)?.name?.toString()}</span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">{data?.title}</h1>

      <p className="text-gray-700 leading-relaxed mb-6">
        {data?.content}
      </p>

      <div className="flex items-center text-gray-500 mb-6">
        <CommentIcon />
        <span className="ml-2">{data?.commentCount} Comments</span>
      </div>

      <div className="mb-8">
        { windowWidth > 768 && 
          <textarea
            className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="What's on your mind..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        }
        <div className="flex justify-end mt-4">
          { windowWidth > 768 && 
            <button className="px-8 py-2 mr-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100" onClick={() => onCancel()}>
            Cancel
          </button>
          }
          <button 
            className={`px-8 py-2 bg-[#49A569] text-white rounded-lg hover:bg-opacity-80 ${windowWidth < 768 ? "w-full" : ""}`} 
            onClick={async() => {
              if(!user?._id) {
                toast.error("Please login to comment")
                setTimeout(() => {
                  router.push("/login")
                }, 1000)
                return
              }
              if(windowWidth < 768) {
                setModal(true)
              } else {
                await onSubmit(comment)
              }
            }}
          >
            Post
          </button>
        </div>
      </div>

      {
        data?.comments?.length > 0 && 
      <div className="mt-20">
        {data?.comments?.map((comment: IComment) => {
          return (
          <div key={comment._id} className="flex items-start mb-6">
            <div className="mr-4">
                {comment?.author?.avatarUrl?.length > 0  ? <img className="w-12 h-12 rounded-full mr-4" src={comment?.author?.avatarUrl} alt="author-avatar" /> : <UserAvatar />}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <p className="font-semibold text-gray-800 mr-2">{comment?.author?.name}</p>
                <p className="text-sm text-gray-500">{moment(comment?.createdAt).fromNow()}</p>
              </div>
              <p className="text-gray-700">{comment?.text}</p>
            </div>
          </div>
          )
        })}
      </div>
      }
      <CreateCommentModal
        modal={modal}
        onClose={() => setModal(false)}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default BlogDetail; 