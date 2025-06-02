import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"

// Tournament Card Component
export default function TournamentCard({ status, game, title, mode, format, platform, prize, players }) {
    const statusColor = status === 'LIVE' ? 'bg-red-500' : 'bg-yellow-500';
    
    return (
      <div className="bg-[#1a1225] rounded-md overflow-hidden">
        <div className="relative">
          <div className="bg-gray-800 h-32">
            {/* Tournament image placeholder */}
          </div>
          <div className={`absolute top-2 right-2 ${statusColor} text-white text-xs px-2 py-1 rounded-full`}>
            {status}
          </div>
        </div>
        <div className="p-4">
          <div className="mb-1 text-gray-400 text-xs">{game}</div>
          <h3 className="mb-2 font-bold text-white">{title}</h3>
          
          <div className="flex items-center mb-2">
            <span className="mr-2 text-white text-xs">👤</span>
            <span className="text-white text-xs">{mode}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-white text-xs">📊</span>
            <span className="text-white text-xs">{format}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="mr-2 text-white text-xs">💻</span>
            <span className="text-white text-xs">{platform}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-bold text-green-400">{prize}</div>
            <div className="flex items-center">
              <span className="text-white text-xs">{players}/64</span>
            </div>
          </div>
        </div>
      </div>
    );
  }