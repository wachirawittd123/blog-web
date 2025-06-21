import { Green500, SuccessColor } from "./Color"
import Image from "next/image"
import { IHeaderProps, IResponseAPI } from "@/interface"
import axios from "axios"
import toast from "react-hot-toast"

const Header: React.FC<IHeaderProps> = ({ user }) => {

  const redirectToLogin = () => {
    window.location.href = '/login'
  }

  const onSignOut = async() => {
    if(!user?._id) return redirectToLogin()
    try {
      const res = await axios.post('/api/auth/logout')
      if(res?.data.status_code === 200) {
        toast.success("Logout successfully")
        setTimeout(() => {
          redirectToLogin()
        }, 1000)
      }
    } catch (err: IResponseAPI | any) {
      toast.error(err?.response?.data?.message || "Logout failed")
    }
    return 
  }

  return (
    <nav className={`bg-[${Green500}] text-white px-4 py-2 flex items-center justify-end`}>
      <div className="flex items-center gap-4">
        {user?._id ? (
          <div className="flex items-center gap-3 cursor-pointer" onClick={onSignOut}>
            <p className="font-semibold">{user.name}</p>
            <Image 
              className="w-10 h-10 rounded-full" 
              src={user.avatarUrl || "/images/default-avatar.png"} 
              alt={user.name || "User avatar"} 
              width={40} 
              height={40} 
            />
          </div>
        ) : (
          <button className={`bg-[${SuccessColor}] text-white px-4 py-2 rounded hover:bg-opacity-80`} onClick={redirectToLogin}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header
