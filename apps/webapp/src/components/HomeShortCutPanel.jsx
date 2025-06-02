'use client';
import { Trophy, Users, ChevronRight, Gamepad2, Swords, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomeShortCutPanel() {
  const router = useRouter();
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);

const [trendingGames, setTrendingGames] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("http://localhost:8000/tournaments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error("❌ Erwartetes Array, aber erhalten:", data);
          return;
        }

        const now = new Date();
        const sorted = data
          .filter(t => t.start_time && new Date(t.start_time) > now)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
          .slice(0, 3);

        setUpcomingTournaments(sorted);
      } catch (error) {
        console.error("❌ Fehler beim Abrufen der Turniere:", error);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
  const fetchTrendingGames = async () => {
    try {
      const res = await fetch("http://localhost:8000/tournaments/stats/popular_games", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("❌ Erwartetes Array, aber erhalten:", data);
        return;
      }

      // Du kannst optional Platzhalter-Kategorien setzen:
      const categorized = data.map(g => ({
        name: g.name,
        category: "Beliebt im letzten Quartal",
        players: `${g.count} Turniere`,
      }));

      setTrendingGames(categorized);
    } catch (error) {
      console.error("❌ Fehler beim Abrufen der Spiele im Trend:", error);
    }
  };

  fetchTrendingGames();
}, []);

  return (
    <div className="hidden md:block bg-[#121428] p-6 w-96">
      {/* Upcoming Tournaments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex font-semibold items-center text-white text-lg">
            <Trophy size={16} className="mr-2 text-[#FF4EF1] font-semibold" />
            Anstehende Turniere
          </h2>
        </div>

        <div className="space-y-4">
          {upcomingTournaments.map((t, index) => {
            const start = new Date(t.start_time);
            const now = new Date();
            const daysLeft = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const timeLeft = daysLeft <= 0 ? "Heute" : `in ${daysLeft} Tag${daysLeft !== 1 ? "en" : ""}`;
            const game = t.game ?? "-";
            const name = t.name ?? "Unbenannt";

            return (
                  <div
                    key={index}
                    onClick={() => router.push(`/tournements/${t.id}/details`)}
                    className="group bg-[#252641] hover:bg-[#2a2b4c] p-4 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-lg"
                  >
                <div className="mb-1">
                  <h3 className="font-semibold text-white group-hover:text-pink-400 text-sm truncate">
                    {name}
                  </h3>
                </div>
                <p className="text-indigo-300 text-xs mb-3">{game}</p>
                <div className="flex justify-between items-center text-[11px] font-medium">
                    <span className="bg-[#dd17c9] text-white font-semibold px-2 py-1 rounded-md">
                      {t.participants_count ?? 0}/{t.max_players} Spieler
                    </span>
                  <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded-md">
                    {timeLeft}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mr-10 ml-10">
          <button
            onClick={async () => {
              const token = localStorage.getItem("token");
              const res = await fetch("http://localhost:8000/profile/me", {
                headers: { Authorization: `Bearer ${token}` },
              });
              const user = await res.json();

              if (user.role === "Admin" || user.role === "Subscriber") {
                router.push('/tournements/create');
              } else {
                alert("Nur Admins oder Abonnenten dürfen Turniere erstellen.");
              }
            }}

            className=" bg-[#dd17c9] hover:bg-[#aa0d9d] text-white font-semibold mt-4 py-3 rounded-xl w-full transition-colors">
          
            <span className="font-semibold font-stretch-150% uppercase">Turnier erstellen</span>
          </button>
        </div>
      </div>

      {/* Trending Games */}
      <div className="mb-8 pt-5 border-t-2 border-t-gray-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex font-semibold items-center text-white text-lg">
            <div className="bg-green-500 mr-2 rounded-full w-3 h-3 animate-pulse"></div>
            Spiele im Trend
          </h2>
        </div>

        <div className="space-y-4">
          {trendingGames.map((game, index) => (
            <div
              key={index}
              className="group flex items-center bg-[#252641] p-3 rounded-xl transition-all cursor-pointer"
            >
              <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center overflow-hidden">
                <img src="/Symbol_Gamerlink.png" alt="Symbol_Gamerlink" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex-1 ml-3">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {game.name}
                </h3>
                <div className="flex justify-between mt-1">
                  <p className="text-indigo-300 text-xs">{game.category}</p>
                  <p className="text-green-400 text-xs">{game.players}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
