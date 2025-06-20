import axios from "axios"

export const getCategoriesServerSide = async() => {
    try {
        const result = await axios.get("http://localhost:3000/api/category")
        if(result?.data?.status_code === 200) return result.data.data
        else return []
    } catch {
        return []
    }
}