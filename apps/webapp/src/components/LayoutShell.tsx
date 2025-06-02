"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Logout from "@/components/Logout";
import { Search } from "lucide-react";


export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideNavbar = pathname.startsWith("/user/login") || pathname.startsWith("/user/register");

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length > 1) {
        fetch(`http://localhost:8000/search?query=${encodeURIComponent(searchTerm)}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            setResults([...data.users, ...data.tournaments]);
            setShowDropdown(true);
          })
          .catch(() => setResults([]));
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Schließt das Dropdown, wenn man außerhalb klickt
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: any) => {
    setSearchTerm("");
    setShowDropdown(false);

    if (item.type === "user") {
      router.push(`/user/profil/view/${item.user_id}`);
    } else if (item.type === "tournament") {
      router.push(`/tournements/${item.tournament_id}/details`);
    }
  };

  return (
    <>
      {!hideNavbar && (
        <nav className="z-10 flex items-center justify-between bg-[#121428] p-4 w-full text-white relative">
          <div className="flex items-center gap-2">
            <img src="/logo.webp" alt="GamerLink Logo" className="w-52" />
          </div>

          <div className="hidden md:flex justify-center flex-1 px-4 relative" ref={dropdownRef}>
            <div className="relative w-full max-w-[400px]">
              <input
                type="text"
                placeholder="SUCHE NACH SPIELERN ODER TURNIEREN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#2a2a4a] px-10 font-semibold py-2 rounded-full w-full text-white placeholder:text-white text-sm"
              />
                <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-white">
                  <Search className="w-4 h-4" />
                </div>


              {showDropdown && results.length > 0 && (
                <div className="absolute mt-2 w-full bg-[#1c1e33] border border-[#2a2a4a] rounded-lg shadow-lg z-50">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelect(item)}
                      className="px-4 py-2 cursor-pointer hover:bg-[#292c47] text-sm"
                    >
                      {item.type === "user" ? (
                        <span>👤 {item.username}</span>
                      ) : (
                        <span>🏆 {item.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Logout />
          </div>
        </nav>
      )}

      {children}
    </>
  );
}
