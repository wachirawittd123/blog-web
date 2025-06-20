import { IBlog, IQuery, IResponseAPI } from "@/interface"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export const useQueryPost = () => {
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
            const result = await axios.get(`/api/blogs`, { params: filter })
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
