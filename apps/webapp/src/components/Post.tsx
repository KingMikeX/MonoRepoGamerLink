'use client';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import React from 'react';

interface PostProps {
  children: React.ReactNode;
  createdAt: string; // ISO-Date
}

export default function Post({ children, createdAt }: PostProps) {
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-6">
      <div className="bg-indigo-900/40 backdrop-blur-sm mr-10 mb-6 ml-10 border border-indigo-700/30 rounded-2xl">
        <div className="flex items-center p-4">
          <div className="flex justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700 shadow-inner rounded-full w-12 h-12 font-bold text-white text-lg">E</div>
          <div className="ml-3">
            <h3 className="font-semibold text-white">ELITE_GAMER</h3>
            <p className="text-indigo-300 text-xs">Turnier-Champion</p>
          </div>
          <div className="flex items-center ml-auto text-gray-400 text-sm">
            <span className="bg-indigo-800/50 px-2 py-0.5 rounded-full text-xs">{formattedDate}</span>
          </div>
        </div>

        <div className="p-4 text-white text-sm border-t border-indigo-800">
          {children}
        </div>

        <div className="bg-indigo-900/30 p-4 border-indigo-700/30 border-t">
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-pink-400 transition-colors">
                <Heart size={18} />
                <span className="text-sm">142</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-300 hover:text-blue-400 transition-colors">
                <MessageCircle size={18} />
                <span className="text-sm">24</span>
              </button>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-300 hover:text-green-400 transition-colors">
                <Share2 size={18} />
              </button>
              <button className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
