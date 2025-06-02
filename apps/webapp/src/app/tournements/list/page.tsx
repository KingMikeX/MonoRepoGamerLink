"use client";

import React, { useEffect, useState } from "react";
import FullSideBar from "@/components/FullSideBar";
import { Trophy } from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  game: string;
  niveau: string;
  start_time: string;
  duration_minutes: number;
  max_players: number;
  description: string;
  created_at: string;
  created_by_username: string;
  teamgroeße?: number;
  teamanzahl?: number;
  participants_count?: number;
}

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const selectedPage = {
    0: "/user/profile",
    1: "/home",
    2: "/tournements/list",
    3: "/user/friends",
    4: "/games/all",
  };

useEffect(() => {
  const fetchTournaments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Fehler beim Laden der Turniere.");
      const data = await res.json();

      const now = new Date();

      const filtered = data.filter((t: Tournament) => {
        const startTime = new Date(t.start_time);
        const endTime = new Date(startTime.getTime() + t.duration_minutes * 60 * 1000);
        const expirationTime = new Date(endTime.getTime() + 7 * 24 * 60 * 60 * 1000);
        return expirationTime > now;
      });

      // Nach Startdatum sortieren (neueste zuerst)
      const sorted = filtered.sort((a: Tournament, b: Tournament) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );

      setTournaments(sorted);
    } catch (err) {
      setError("Turniere konnten nicht geladen werden.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchTournaments();
}, []);


  const fetchTournamentDetails = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        throw new Error("Turnierdetails konnten nicht geladen werden.");
      }
      const data = await res.json();
      setSelectedTournament(data);
    } catch (err) {
      console.error(err);
      alert("Fehler beim Laden der Turnierdetails.");
    }
  };

  const handleJoin = async (tournamentId: string) => {
    try {
      setJoining(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/${tournamentId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.detail || "Beitritt fehlgeschlagen.");
        return;
      }
      const result = await res.json();
      alert(result.message || "Erfolgreich beigetreten.");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Beitritt.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#252641] text-white">
      <FullSideBar which_Page={selectedPage[2]} />

      <div className="flex-1 px-10 py-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">

          <button
            onClick={async () => {
              const token = localStorage.getItem("token");
              const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/me`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const user = await res.json();

              if (user.role === "Admin" || user.role === "Subscriber") {
                window.location.href = "/tournements/create";
              } else {
                alert("Nur Admins oder Abonnenten dürfen Turniere erstellen.");
              }
            }}
            className="bg-[#dd17c9] hover:bg-[#aa0d9d] text-white font-semibold px-5 py-2 rounded-xl transition-colors uppercase"
          >
            Turnier erstellen
          </button>

        </div>

        {selectedTournament && (
          <div className="mb-10 bg-[#121428] rounded-2xl shadow-xl p-6 md:flex gap-6">
            <div  />
              <div className="bg-white w-full md:max-w-sm h-64 rounded-xl flex items-center justify-center">
                <img src="/Symbol_Gamerlink.png" alt="Symbol_Gamerlink" className="w-20 h-20 object-contain" />
              </div>

              
            <div className="flex-1">
              <div className="bg-[#dd17c9] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                FEATURED
              </div>
              <h2 className="text-2xl font-bold mb-2 uppercase tracking-wide">{selectedTournament.name}</h2>

              <div className="text-sm text-white grid grid-cols-2 gap-y-1 mb-4">
                <p><span className="font-semibold">SPIEL:</span> {selectedTournament.game}</p>
                <p><span className="font-semibold">START:</span> {new Date(selectedTournament.start_time).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</p>
                <p><span className="font-semibold">MAX. SPIELER:</span> {selectedTournament.max_players}</p>
                <p><span className="font-semibold">TEAMGRÖßE:</span> {selectedTournament.teamgroeße ?? "-"}</p>
                <p><span className="font-semibold">TEAMANZAHL:</span> {selectedTournament.teamanzahl ?? "-"}</p>
                <p><span className="font-semibold">BISHER TEILNEHMER:</span> {selectedTournament.participants_count ?? 0}</p>
                <p><span className="font-semibold">ERSTELLT VON:</span> {selectedTournament.created_by_username}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleJoin(selectedTournament.id)}
                  className="px-5 py-2 bg-[#dd17c9] hover:bg-[#aa0d9d] rounded-xl text-white font-bold text-sm"
                  disabled={joining}
                >
                  {joining ? "Wird beigetreten..." : "JETZT ANMELDEN"}
                </button>
                <a
                  href={`/tournements/${selectedTournament.id}/details`}
                  className="px-5 py-2 bg-[#2c2c4e] hover:bg-[#3b3b63] rounded-xl text-white font-bold text-sm"
                >
                  DETAILS ANSEHEN
                </a>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p>Lade Turniere...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="bg-[#121428] rounded-2xl shadow-lg p-5 relative hover:scale-[1.02] transition-transform cursor-pointer"
                onClick={() => fetchTournamentDetails(t.id)}
              >
                  {(() => {
                    const startTime = new Date(t.start_time);
                    const now = new Date();
                    const isUpcoming = startTime > now;
                    const badgeText = isUpcoming ? "BALD" : "LIVE";
                    const badgeColor = isUpcoming ? "bg-orange-400 text-black font-semibold" : "bg-red-500 text-white font-semibold";

                    return (
                      <div className={`absolute top-4 right-4 ${badgeColor} text-xs font-bold px-3 py-1 rounded-full`}>
                        {badgeText}
                      </div>
                    );
                  })()}

                <div  />
                  <div className="bg-white h-32 w-full rounded-xl mb-4 flex items-center justify-center">
                    <img src="/Symbol_Gamerlink.png" alt="Symbol_Gamerlink" className="w-20 h-20 object-contain" />
                  </div>
                <p className="text-xs text-[#FF4EF1] font-semibold">{t.game}</p>
                <h2 className="text-lg font-semibold">{t.name}</h2>
                <p className="text-sm font-semibold text-gray-300">{t.max_players} SPIELER</p>
                <p className="text-sm font-semibold text-gray-300">{t.niveau.toUpperCase()}</p>
                <p className="text-sm font-semibold text-[#39ff14] font-bold mt-2">
                  Start: {new Date(t.start_time).toLocaleString("de-DE")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}