import { IHeaderBlog } from "@/interface"
import { FaSearch } from 'react-icons/fa';  // Importing the search icon
import { SelectComponent } from "../Select";
import { Green300, SuccessColor } from "../Color";
import { getWindowWidth } from "@/lib/fontend/get-width-window";

export const HeaderBlog: React.FC<IHeaderBlog> = ({
    search,
    onChange,
    onAdd,
    categories
}) => {
    const { windowWidth } = getWindowWidth()
    return (
        <div className={`w-full ${ windowWidth < 768 ? "py-2" : "lg:px-4 py-4"}`}>
            <div className="max-w-5xl mx-auto flex flex-col flex-row justify-between items-center">
                <div className="flex-1 relative sm:w-[40%] lg:[70%]">
                    <input
                        type="text"
                        placeholder={windowWidth > 768 ? "Search" : ''}
                        className="w-full px-4 py-2 pl-10 rounded-md lg:border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                        value={search.query || ''}
                        onChange={(e) => onChange(e, "query")}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                <div className="flex gap-2 sm:w-[50%] lg:w-[30%] items-center">
                    <SelectComponent 
                        value={search.category as string}
                        options={categories}
                        onChange={onChange}
                    />
                    <button 
                        className={`bg-[#49A569] text-white px-4 py-2 rounded-md hover:bg-[${Green300}] transition duration-200 cursor-pointer`}
                        onClick={onAdd}
                    >
                        Create +
                    </button>
                </div>
            </div>
        </div>
    )
}
