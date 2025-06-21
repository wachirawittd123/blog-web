import Layout from '@/components/Layout'
import { IBlog, IGetServerSideProps, IResponseAPI, IUser } from '@/interface'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { convertToken } from '@/lib/fontend/auth'
import BlogDetail from '@/components/blog/BlogDetail'
import { connectDB } from '@/lib/mongo'
import User from '@/models/User'
import { getUserServerSide } from '@/documents/user'
import { useQueryBlogDetail } from '@/documents/blog'
import { useRouter } from 'next/router'
import { LoadingComponent } from '@/components/Loading'
import axios from 'axios'
import toast from 'react-hot-toast'


export async function getServerSideProps(context: GetServerSidePropsContext) {
  await connectDB()
  const { req } : any = context
  const personal = convertToken(req)
  
  if (!personal?.user?.id) {
    return { props: { ...personal } }
  }

  const user = await getUserServerSide(personal)
  
  return {
    props: {
      token: personal.token,
      user,
    },
  }
}

const BlogDetailPage: React.FC<IGetServerSideProps> = ({ user }) => {
  const router = useRouter()
  const { id } = router.query
  const { data, loading, _fetch } = useQueryBlogDetail(id as string) 

  const onComment = async(text: string) => {
    try {
        const result = await axios.post(`/api/comments`, {
            text,
            blog: id,
            author: user?._id
        })
        if(result?.data?.status_code === 200) {
            toast.success(result?.data?.message)
            await _fetch()
        }
    } catch(err: IResponseAPI | any) {
        toast.error(err?.response?.data?.message)
    }
  }

  if(loading) return <LoadingComponent />

  return (
    <Layout user={user} bgcolor="#F9FAFB">
        <BlogDetail data={data as IBlog} onComment={onComment} user={user as IUser} />
    </Layout>
  )
}

export default BlogDetailPage