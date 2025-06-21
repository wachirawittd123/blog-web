// components/Layout.tsx
import Sidebar from './Sidebar'
import Header from './Header'
import { LayoutProps } from '@/interface'

const Layout = ({ children, user, bgcolor = "#BBC2C0" }: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-[${bgcolor}]`}>
      <Header user={user} />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
