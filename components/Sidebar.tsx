import { ISiderData } from "@/interface"
import { SiderData } from "@/mock-data/sider-mock"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Green500, Grey100 } from "./Color"

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className={`hidden lg:flex flex-col w-[240px] bg-[${Grey100}] text-white px-6 py-8`}>
      <nav className="flex flex-col gap-4 text-base">
        {
          SiderData.map((item: ISiderData, index: number) => {
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
                    text-lg text-[${Green500}] 
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
    </aside>
  )
}

export default Sidebar
