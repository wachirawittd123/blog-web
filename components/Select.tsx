import { ICategory, ISelectComponent } from "@/interface";
import { useCallback, useState } from "react";
import Image from "next/image";
import { getWindowWidth } from "@/lib/fontend/get-width-window";

export const SelectComponent: React.FC<ISelectComponent> = ({ onChange, value, options, width = "auto" }) => {
    const { windowWidth } = getWindowWidth()
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectCategory = (category: string) => {
        onChange(category, "category");
        setIsOpen(false);
    }

    const selectValue = useCallback(() => {
        if(options?.length === 0) return ""
        return options?.filter((e: ICategory) => e._id === value)[0]?.name
    },[value, options])

    return (
        <div className="relative">
            <div
                className={`
                    flex justify-between items-center px-3 py-2 text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none
                    lg:w-[200px] sm:w-auto
                `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectValue()}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-600"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {isOpen && (
                <div 
                    className={`
                        absolute mt-2 bg-white border border-gray-300 
                        rounded-md shadow-lg max-h-60 overflow-y-auto
                        ${windowWidth < 768 ? "w-[200px] right-[-10px]" : "right-0 min-w-xs"}
                    `}
                >
                    <ul>
                        {options?.map((category: ICategory, index: number) => {
                            let isActive: boolean = category._id === value;
                            return (
                                <li
                                    key={index}
                                    className={`
                                        px-4 py-2 cursor-pointer hover:bg-[#D8E9E4]
                                        ${isActive ? `bg-[#D8E9E4]` : ""}
                                    `
                                    }
                                    onClick={() => handleSelectCategory(category._id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>{category.name}</div>
                                        {isActive &&<div><Image alt="check-icon" src="/images/check.png" width={18} height={18} /></div>}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}