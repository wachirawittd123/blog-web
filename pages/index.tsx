import { HeaderBlog, PostList } from '@/components/blog'
import Layout from '@/components/Layout'
import { ICategory, ICreatePost, IGetServerSideProps, IQuery, ISearchBlog } from '@/interface'
import { GetServerSidePropsContext } from 'next'
import React, { useState } from 'react'
import { convertToken } from '@/lib/fontend/auth'
import { getCategoriesServerSide } from '@/documents/categories'
import { useQueryPost } from '@/documents/blog'
import { CreatePostModal } from '@/components/blog/create-post-modal'
import toast from 'react-hot-toast'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context
  const personal = convertToken(req)
  let categories: ICategory[] = await getCategoriesServerSide()
  
  return {
    props: {
      ...personal,
      categories: [{_id: "all", name: "All"}, ...categories]
    },
  }
}

const MainPage: React.FC<IGetServerSideProps> = ({ user, categories }) => {
  const [search, setSearch] = useState<ISearchBlog>({query: '', category: 'all'})
  const [modalAdd, setModalAdd] = useState(false)

  const { data, setFilter, _fetch } = useQueryPost()

  const isModal = () => {
    if(!user?.id) {
      toast.error("Please login to create a post")
      return window.location.href = '/login'
    }
    setModalAdd(!modalAdd)
  }

  const onSearch = (e: React.ChangeEvent<HTMLInputElement> | any, key: string) => {
    setSearch({...search, [key]: key === "query" ? e?.target?.value : e})
    setFilter((f: IQuery) => {
      let newFilter = {...f}
      if(key === "query") newFilter.search = e?.target?.value
      if(key === "category") {
        if(e === "all") {
          newFilter.category = ''
        } else {
          newFilter.category = e
        }
      }
      return newFilter
    })
  }

  const onFinish = async (values: ICreatePost) => {

  }

  return (
    <Layout>
      <HeaderBlog 
        search={search} 
        onChange={onSearch}
        onAdd={isModal} 
        categories={categories as ICategory[]}
      />
      <PostList blogs={data} />
      <CreatePostModal 
        isOpen={modalAdd}
        onClose={isModal}
        onSubmit={onFinish}
        categories={categories as ICategory[]}
      />
    </Layout>
  )
}

export default MainPage
