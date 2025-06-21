import { IConvertToken, IResponseAPI, IVerifyToken } from "@/interface"
import axios from "axios"

export const getUserServerSide = async(data: IConvertToken) => {
    try {
        const result: IResponseAPI | any = await axios({
            method: "GET",
            url: `http://localhost:3000/api/user/${data?.user?.id}`,
            headers: {
                "Authorization": `Bearer ${data?.token}`
            }
        })
        if(result?.data?.status_code === 200) return result.data.data
        else return null
    } catch(err: IResponseAPI | any) {
        return null
    }
}