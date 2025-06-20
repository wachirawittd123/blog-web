import { ExpandData } from "@/mock-data/sider-mock"
import { Green500, SuccessColor, White } from "./Color"
import Image from "next/image"
import { useState } from "react"
import { ISiderData } from "@/interface"
import { usePathname } from "next/navigation"
import { FaArrowRight } from "react-icons/fa"

const Header = () => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className={`bg-[${Green500}] text-white px-4 py-4 flex items-center justify-between lg:justify-between`}>
      <p className="hidden lg:block text-2xl italic font-medium">a Board</p>
      
      <div className="flex items-center gap-4 ml-auto">
        <button className={`hidden lg:block bg-[${SuccessColor}] text-white px-4 py-2 rounded hover:bg-gray-100`}>
          Sign In
        </button>
        
        <div className="lg:hidden flex items-center justify-end">
          <div className="text-white px-4 py-2 rounded hover:bg-gray-100 cursor-pointer" onClick={toggleMenu}>
            <Image alt="menu-more-icon" src="/images/menu-more.png" width={24} height={24} />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className={`absolute z-10 top-0 right-0 bg-[${Green500}] text-white w-3/4 h-full p-7 lg:hidden flex flex-col items-start rounded-tl-[12px] rounded-bl-[12px]`}>
          <div className="flex items-center justify-start w-full mb-4">
            <button onClick={toggleMenu} className="text-white">
              <FaArrowRight className="text-xl" />
            </button>
          </div>
          <nav className="flex flex-col gap-4 text-base mt-5">
        {
          ExpandData.map((item: ISiderData, index: number) => {
            const isActive: boolean = pathname === item.path
            return (
              <div 
                key={index} 
                className={"flex items-center gap-4"}
              >
                <Image alt={`image-${index}`} src={item.icon} width={25} height={25} />
                <a 
                  href={item.path} 
                  className={`
                    text-lg text-[${White}] 
                    ${isActive ? `font-semibold` : `font-normal`}
                  `
                 }
                >
                  {item.label}
                </a>
              </div>
            )
            
          })
        }
      </nav>
        </div>
      )}
    </nav>
  )
}

export default Header
