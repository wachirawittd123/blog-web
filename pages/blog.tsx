import { HeaderBlog, PostList } from '@/components/blog'
import Layout from '@/components/Layout'
import { IBlog, ICategory, IGetServerSideProps, IResponseAPI } from '@/interface'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { convertToken } from '@/lib/fontend/auth'
import { getCategoriesServerSide } from '@/documents/categories'
import { useFunctionBlog } from '@/documents/blog'
import { CreatePostModal } from '@/components/blog/create-post-modal'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getUserServerSide } from '@/documents/user'
import { getWindowWidth } from '@/lib/fontend/get-width-window'


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context
  const personal = convertToken(req)
  let categories: ICategory[] = await getCategoriesServerSide()
  
  if(!personal?.user?.id) {
    return {
      props: {
        categories: [{_id: "all", name: "All"}, ...categories]
      }
    }
  }
  const user = await getUserServerSide(personal)
  return {
    props: {
      user,
      categories: [{_id: "all", name: "All"}, ...categories]
    },
  }
}

const BlogPage: React.FC<IGetServerSideProps> = ({ user, categories }) => {
  const { search, onSearch, isModal, modalAdd, onFinish, data, _fetch, setModalAdd } = useFunctionBlog({user, typeQuery: "private", author: user?._id})
  const { windowWidth } = getWindowWidth()

  const onEdit = (values: IBlog) => {
    setModalAdd({visible: !modalAdd.visible, data: values || null})
  }

  const onDelete = async(id: string) => {
    try {
        const res = await axios.delete(`/api/blogs/${id}`)
        if(res?.data?.status_code === 200) {
            toast.success("Delete post successfully")
            _fetch()
        }
    } catch (err: IResponseAPI | any) {
        toast.error(err?.response?.data?.message || "Delete post failed")
    }
  }
  
  return (
    <Layout user={user}>
      <HeaderBlog 
        search={search} 
        onChange={onSearch}
        onAdd={() => isModal()} 
        categories={categories as ICategory[]}
      />
      <PostList 
        typeQuery={user?._id ? "private" : "all"}
        blogs={data} 
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <CreatePostModal 
        modal={modalAdd}
        onClose={isModal}
        onSubmit={onFinish}
        categories={categories as ICategory[]}
      />
    </Layout>
  )
}

export default BlogPage
