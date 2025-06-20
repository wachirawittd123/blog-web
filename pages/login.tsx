import { Green300, SuccessColor } from '@/components/Color'
import { IResponseAPI } from '@/interface/common.interface'
import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [username, setUsername] = useState<string>('')
  const [error, setError] = useState<string>('')

  const resetField = () => {
    setUsername('')
    setError('')
  }

  const onFinish = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    try {
      const result: IResponseAPI = await axios.post('/api/auth/login', { username })
      resetField()
      if(result?.data?.status_code === 200) {
        toast.success(result?.data?.message)
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      } else {
        toast.error(result?.data?.message)
      }
    } catch (err: IResponseAPI | any) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
      resetField()
    }
  }


  return (
    <div className="min-h-screen bg-[#243831] flex flex-col lg:grid lg:grid-cols-2">
      {/* Mobile Logo */}
      <div className="lg:hidden bg-[#2B5F44] flex flex-col items-center justify-center py-8 px-4 rounded-b-3xl min-h-[362px]">
        <Image
          src="/images/board-illustration.png"
          alt="Board"
          width={150}
          height={150}
          className="mb-4"
        />
        <p className="text-white italic text-xl">a Board</p>
      </div>

      {/* Form Section */}
      <div className="flex flex-col flex-1 justify-start lg:justify-center p-6">
        <form
          onSubmit={onFinish}
          className="w-full max-w-sm space-y-6 mt-28 lg:mt-0 mx-auto"
          noValidate
        >
          <h1 className="text-white text-2xl font-semibold text-4xl">Sign in</h1>

          <div className="space-y-1">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2 rounded bg-white text-black focus:outline-none ${
                error ? 'border border-red-500' : ''
              }`}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-[${SuccessColor}] hover:bg-[${Green300}] text-white py-2 rounded font-medium transition`}
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Desktop Illustration */}
      <div className="hidden lg:flex bg-[Green300] items-center justify-center rounded-l-3xl">
        <div className="text-center">
          <Image
            src="/images/board-illustration.png"
            alt="Board"
            width={300}
            height={300}
            className="mb-6"
          />
          <p className="text-white italic text-3xl">a Board</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
