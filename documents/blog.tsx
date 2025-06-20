import { IBlog, ICreatePost, IFunctionBlog, IModalAddBlog, IQuery, IResponseAPI, ISearchBlog } from "@/interface"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export const useQueryPost = (typeQuery: string, author?: string) => {
    const [data, setData] = useState<IBlog[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [filter, setFilter] = useState<IQuery>({ limit: 10, page: 1, search: '', category: '' })

    const setDefaultData = () => {
        setData([])
        setTotal(0)
    }

    const _fetch = async () => {
        setLoading(true)
        try {
            const result = await axios.get(`/api/blogs`, { params: {...filter, typeQuery, author: author || ""} })
            if (result?.data?.status_code === 200) {
                setData(result?.data?.data)
                setTotal(result?.data?.pagination?.total)
            } else {
                setDefaultData()
            }
        } catch (err: IResponseAPI | any) {
            toast.error(err?.response?.data?.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        _fetch() // Fix: invoke the function
    }, [filter]) // Re-run whenever the filter changes

    return {
        _fetch,
        data,
        total,
        page,
        setPage,
        loading,
        filter,
        setFilter
    }
}

export const useFunctionBlog = ({user, typeQuery = "all", author = ""}: IFunctionBlog) => {
  const defaultModal: IModalAddBlog = {visible: false, data: null}
  const [search, setSearch] = useState<ISearchBlog>({query: '', category: 'all'})
  const [modalAdd, setModalAdd] = useState<IModalAddBlog>(defaultModal)

  const { data, setFilter, _fetch } = useQueryPost(typeQuery, author)

  const isModal = (values?: IBlog) => {
    if(!user?.id) {
      toast.error("Please login to create a post")
      return window.location.href = '/login'
    }
    setModalAdd({visible: !modalAdd.visible, data: values|| null})
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
    try {
      const res = await axios.post('/api/blogs', values)
      if(res?.data?.status_code === 200) {
        toast.success("Create post successfully")
        setModalAdd(defaultModal)
        _fetch()
      }
    } catch (err: IResponseAPI | any) {
      toast.error(err?.response?.data?.message || "Create post failed")
    }
  }

  return {
    onFinish,
    isModal,
    onSearch,
    search,
    modalAdd,
    setModalAdd,
    data,
    setFilter,
    _fetch
  }
}
