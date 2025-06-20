import { HeaderBlog, PostList } from '@/components/blog'
import Layout from '@/components/Layout'
import { ICategory, IGetServerSideProps } from '@/interface'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { convertToken } from '@/lib/fontend/auth'
import { getCategoriesServerSide } from '@/documents/categories'
import { useFunctionBlog, useQueryPost } from '@/documents/blog'
import { CreatePostModal } from '@/components/blog/create-post-modal'


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
  const { search, onSearch, isModal, modalAdd, onFinish, data } = useFunctionBlog({user, typeQuery: "all"})
  return (
    <Layout user={user}>
      <HeaderBlog 
        search={search} 
        onChange={onSearch}
        onAdd={isModal} 
        categories={categories as ICategory[]}
      />
      <PostList blogs={data} />
      <CreatePostModal 
        modal={modalAdd}
        onClose={isModal}
        onSubmit={onFinish}
        categories={categories as ICategory[]}
      />
    </Layout>
  )
}

export default MainPage
