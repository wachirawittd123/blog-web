import { IBlog, IPostList } from "@/interface"
import Image from "next/image"
import { Grey300 } from "../Color"
import { getWindowWidth } from "@/lib/fontend/get-width-window"

export const PostList: React.FC<IPostList> = ({ blogs, typeQuery = 'all', onEdit, onDelete }) => {
    const { windowWidth } = getWindowWidth()
    return (
        <div className={`flex justify-center ${windowWidth < 768 ? "py-4" : "px-4 py-4"}`}>
        <div className="w-full max-w-5xl space-y-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                {
                    blogs.map((blog: IBlog, index: number) => {
                        return (
                            <div key={index}>
                                <div className="p-5">
                                    <div className="flex items-center gap-4 mb-4 justify-between">
                                        <div className="flex items-center gap-6">
                                            <Image
                                                className="w-15 h-15 rounded-full object-cover"
                                                alt={`${blog?.author?.name}`}
                                                src={blog?.author?.avatarUrl}
                                                width={100}
                                                height={100}
                                            />
                                            <div className="flex flex-col justify-center">
                                                <span className={`text-lg text-[${Grey300}]`}>{blog?.author?.name}</span>
                                            </div>
                                        </div>
                                        { 
                                          typeQuery === "private" && 
                                            <div className="flex gap-3">
                                              <button className="text-black py-2" onClick={async () => await onDelete?.(blog._id)}>
                                                <Image alt="delete" src="/images/trash-postlist.png" width={16} height={16} /> 
                                              </button>
                                              <button className="text-black py-2" onClick={async () => await onEdit?.(blog)}>
                                                <Image alt="edit" src="/images/edit-list.png" width={16} height={16} />
                                              </button> 
                                            </div>
                                        }
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="text-base bg-gray-100 text-[#4A4A4A] px-3 py-1 rounded-2xl p-20px">
                                            {blog.categories.name}
                                        </div>
                                    </div>
                                    <div className={`mt-2 text-2xl text-[#101828] font-semibold`}>
                                        {blog.title}
                                    </div>
                                    <div className={`mt-1 text-sm text-[#101828]`}>
                                        <div className="line-clamp-2"> 
                                            {blog.content}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm cursor-pointer" onClick={async () => window.location.href = `/blog/${blog._id}`}>
                                        <div>
                                            <Image alt="message-circle" src="/images/message-circle-02.png" width={16} height={16} />
                                        </div>
                                        <div>
                                            {blog.commentCount} Comments
                                        </div>
                                    </div>
                                </div>
                                { blogs?.length - 1 !== index && <div className="border-1 border-[#BBC2C0] "></div>}
                            </div>
                        )
                    })
                }
            </div>
          {/* {posts.map((post, index) => (
            <div key={index} className="bg-white p-4 rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-medium">
                  {post.user[0]}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-medium">{post.user}</span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-black">{post.title}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.description}</p>
              <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                <FaRegCommentDots />
                <span>{post.comments} Comments</span>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    )
}