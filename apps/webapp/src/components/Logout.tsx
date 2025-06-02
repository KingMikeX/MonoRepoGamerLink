"use client";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    router.push("/user/login");
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleLogout}
        className="bg-[#dd17c9] hover:bg-[#aa0d9d] text-white font-semibold px-5 py-2 rounded-xl transition-colors uppercase"
      >
        Logout
      </button>
    </div>
  );
}
