
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [activeTab, setActiveTab] = useState('TURNIERE');
  const [expanded, setExpanded] = useState(true)

  return (
    <aside className="h-screen">
      <nav className="flex bg-[#121428] shadow-sm">
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, onClick, selected }) {
  const expanded = useContext(SidebarContext)

  if(selected == true){
    return (
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-mono rounded-3xl cursor-pointer
                    transition-colors delay-75 group bg-[#252641] text-[#FF4EF1]`}
                    onClick={onClick}>
        {icon}
        <span
          className={`overflow-hidden font-semibold transition-all text-[#FF4EF1] ${ expanded ? "w-52 ml-3" : "w-0" }`}>
          {text}
        </span>
      </li>
    )
  }else{
    return (
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-mono hover:transition-colors hover:ease-in hover:delay-100 rounded-3xl cursor-pointer
                    transition-colors delay-75 group hover:bg-[#252641] bg-[#121428]`}
                    onClick={onClick}>
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
  
        {!expanded && (
          <div
            className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
          >
            {text}
          </div>
        )}
      </li>
    )
  }

}