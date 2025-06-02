"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FullSideBar from "@/components/FullSideBar";
import { Trophy, Users, Flag, Clock, Calendar, Info } from "lucide-react";

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
  teamanzahl: number;
  teamgroeße: number;
  participants_count: number;
  entry_fee: number;
  timezone: string;
  check_in_required: boolean;
  rules: string;
  mode: string;
  scoring_system: string;
  registration_start: string;
  registration_end: string;
  is_public: boolean;
  invite_only: boolean;
}

interface Participant {
  user_id: string;
  username: string;
  joined_at: string;
}

interface Match {
  id: string;
  team_a_name: string;
  team_b_name: string;
  team_a_id?: string;  
  team_b_id?: string;  
  is_played: boolean;
  played_at: string | null;
  winner_team_id: string | null;
  matchday: number;
}



export default function TournamentDetailsPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedTeamNames, setEditedTeamNames] = useState<Record<string, { teamA: string; teamB: string }>>({});
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const isParticipant = Array.isArray(participants) && participants.some(p => p.username === currentUsername);



  const [joining, setJoining] = useState(false);

const handleJoin = async () => {
  try {
    setJoining(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/${id}/join`, {
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
    window.location.reload(); // Optional: Seite neu laden
  } catch (err) {
    console.error(err);
    alert("Fehler beim Beitritt.");
  } finally {
    setJoining(false);
  }
};

const handleTeamNameChange = (matchId: string, team: 'A' | 'B', value: string) => {
  const existing = editedTeamNames[matchId];
  const match = matches.find(m => m.id === matchId);
  if (!match) return;

  setEditedTeamNames(prev => ({
    ...prev,
    [matchId]: {
      teamA: team === 'A' ? value : existing?.teamA ?? match.team_a_name,
      teamB: team === 'B' ? value : existing?.teamB ?? match.team_b_name,
    },
  }));

  setMatches(prev => prev.map(m =>
    m.id === matchId
      ? {
          ...m,
          team_a_name: team === 'A' ? value : m.team_a_name,
          team_b_name: team === 'B' ? value : m.team_b_name,
        }
      : m
  ));
};


const saveTeamNames = async (matchId: string) => {
  const names = editedTeamNames[matchId];
  if (!names) return;

  // Wenn ein Teamname leer ist, sende ihn NICHT mit (sonst wird z. B. team_b_id überschrieben)
  const payload: any = {};
  if (names.teamA && names.teamA.trim() !== "") {
    payload.team_a_name = names.teamA;
  }
  if (names.teamB && names.teamB.trim() !== "") {
    payload.team_b_name = names.teamB;
  }

  if (Object.keys(payload).length === 0) return; // nichts zu speichern

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/${id}/matches/${matchId}/rename-teams`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Fehler beim Speichern");
    }

    console.log("Teamnamen erfolgreich gespeichert");
  } catch (error) {
    console.error("Fehler beim Speichern der Teamnamen:", error);
  }
};



  const submitResult = async (matchId: string, winnerName: string | null) => {
    try {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    let winnerTeamId: string | null = null;
    if (winnerName === match.team_a_name) {
      winnerTeamId = match.team_a_id!;
    } else if (winnerName === match.team_b_name) {
      winnerTeamId = match.team_b_id!;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/${id}/matches/${matchId}/result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ winner_team_id: winnerTeamId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.detail || "Fehler beim Eintragen.");
      return;
  }


    // Nach erfolgreicher Speicherung: Matchliste aktualisieren
    setMatches(prev =>
      prev.map(m =>
        m.id === matchId
          ? { ...m, is_played: true, winner_team_id: winnerTeamId, played_at: new Date().toISOString() }
          : m
      )
    );
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
  }
};

useEffect(() => {
  if (!id) return;

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Fehler beim Laden des Benutzers");

      const data = await res.json();
      setCurrentUsername(data.username);
      setIsAdmin(data.is_admin ?? false); // Falls `is_admin` im Backend existiert
    } catch (err) {
      console.error("Fehler beim Laden des aktuellen Benutzers:", err);
    }
  };

  const fetchData = async () => {
    await fetchCurrentUser(); // 👈 zuerst Benutzer laden

    try {
      const resTournament = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const tournamentData = await resTournament.json();

      const resParticipants = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/${id}/participants`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const participantData = await resParticipants.json();

      const resMatches = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/${id}/matches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const matchData = await resMatches.json();

      setTournament(tournamentData);
      setParticipants(participantData);

      // Matches propagieren
      const propagatedMatches = [...matchData];

      setMatches(propagatedMatches);
    } catch (error) {
      console.error("Fehler beim Laden der Turnierdetails:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);


  if (loading || !tournament) return <p>Lade Turnierdetails...</p>;

  const saveAllTeamNames = async () => {
  try {
    for (const matchId of Object.keys(editedTeamNames)) {
      await saveTeamNames(matchId);
    }
    alert("Alle Teamnamen wurden gespeichert.");
  } catch (error) {
    console.error("Fehler beim Speichern aller Teamnamen:", error);
  }
};

const isOwnerOrAdmin = currentUsername === tournament.created_by_username || isAdmin;

  return (
    <div className="flex min-h-screen bg-[#252641] text-white font-semibold">
      <FullSideBar which_Page="/tournaments/list" />
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-white text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4 uppercase">
           {tournament.name}
          </h1>
          <div className="text-m text-white grid grid-cols-2 gap-y-3 mb-4">
            <p>Spiel: {tournament.game}</p>
            <p>Start: {new Date(tournament.start_time).toLocaleString("de-DE")}</p>
            <p>Max. Spieler:{tournament.max_players}</p>
            <p>Teamgröße: {tournament.teamgroeße}</p>
            <p>Teamanzahl: {tournament.teamanzahl}</p>
            <p>Erstellt von: {tournament.created_by_username}</p>
            <p>Dauer: {tournament.duration_minutes} Minuten</p>
            <p>Gebühr: {tournament.entry_fee} €</p>
            <p>Zeitzone: {tournament.timezone}</p>
            <p>Check-In: {tournament.check_in_required ? "Ja" : "Nein"}</p>
            <p>Regeln: {tournament.rules}</p>
            <p>Modus: {tournament.mode}</p>
            <p>Scoring: {tournament.scoring_system}</p>
            <p>Registrierung: {new Date(tournament.registration_start).toLocaleString("de-DE")} – {new Date(tournament.registration_end).toLocaleString("de-DE")}</p>
            <p>Sichtbarkeit: {tournament.is_public ? "Öffentlich" : "Privat"}</p>
            <p>Nur mit Einladung: {tournament.invite_only ? "Ja" : "Nein"}</p>
          </div>
        </div>

        {!isParticipant && (
        <div className="mb-8">
          <button
            className="px-5 py-2 bg-[#dd17c9] hover:bg-[#aa0d9d] rounded-xl text-white font-semibold text-sm"
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? "Wird beigetreten..." : "JETZT ANMELDEN"}
          </button>
        </div>
      )}


        <div className="mb-8">
          <h2 className= "text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4 uppercase"> Teilnehmer</h2>
          {participants.length > 0 ? (
            <ul>
              {participants.map((p) => (
                <li key={p.user_id} className="text-white mb-2">{p.username}</li>
              ))}
            </ul>
          ) : (
            <p className="text-white">Keine Teilnehmer gefunden.</p>
          )}
        </div>

        <div>
          {isOwnerOrAdmin && (
            <div className="flex mb-2">
              <button
                className="px-4 py-2 bg-[#dd17c9] hover:bg-[#aa0d9d] rounded-xl text-white font-semibold text-sm uppercase"
                onClick={saveAllTeamNames}
              >
                Alle Teamnamen speichern
              </button>
            </div>
          )}


          <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4 pt-6 uppercase"> Matches</h2>
          {matches.length > 0 ? (
            <ul>

        {matches.map((m) => {
        const names = m.is_played
        ? { teamA: m.team_a_name, teamB: m.team_b_name } 
        : editedTeamNames[m.id] || { teamA: m.team_a_name, teamB: m.team_b_name };

        const winnerName =
          m.winner_team_id === m.team_a_id
            ? m.team_a_name
            : m.winner_team_id === m.team_b_id
            ? m.team_b_name
            : null;

        const isDraw = m.is_played && !m.winner_team_id;

        return (
          <div key={m.id} className="text-white mb-4 border-b  font-semibold pb-2">
            <p className="mb-1">
              <span className="font-semibold uppercase">Matchday {m.matchday}:</span>{" "}
              <input
                className="bg-[#121428]  px-2 py-1 rounded mr-1 text-white"
                value={names.teamA}
                onChange={(e) => handleTeamNameChange(m.id, "A", e.target.value)}
                placeholder="Team A"
                disabled={m.is_played || !isOwnerOrAdmin}
              />{" "}
              vs.{" "}
              <input
                className="bg-[#121428] px-2 py-1 rounded mr-1 text-white"
                value={names.teamB}
                onChange={(e) => handleTeamNameChange(m.id, "B", e.target.value)}
                placeholder="Team B"
                disabled={m.is_played || !isOwnerOrAdmin}
              />
              {m.is_played ? (
                <span className="ml-2 text-[#39ff14] font-semibold">(Beendet)</span>
              ) : (
                <span className="ml-2 text-[#FF4EF1]">(Ausstehend)</span>
              )}
            </p>

            {!m.is_played && isOwnerOrAdmin ? (
              <div className="flex gap-3 mt-4 ">
                <button
                  className="bg-orange-600 px-3 py-1 rounded-xl text-white text-sm hover:bg-orange-700 uppercase"
                  onClick={() => submitResult(m.id, names.teamA)}
                >
                  Sieger: {names.teamA}
                </button>
                <button
                  className="bg-[#dd17c9] px-3 py-1 rounded-xl text-white text-sm hover:bg-[#aa0d9d] uppercase"
                  onClick={() => submitResult(m.id, names.teamB)}
                >
                  Sieger: {names.teamB}
                </button>
                <button
                  className="bg-gray-600 px-3 py-1 rounded-xl text-white text-sm hover:bg-gray-700 uppercase"
                  onClick={() => submitResult(m.id, null)}
                >
                  Unentschieden
                </button>
              </div>
            ) : (
              <div className="mt-2">
                {isDraw ? (
                  <span className="text-gray-400 italic">Unentschieden</span>
                ) : (
                <span className="text-[#39ff14] font-semibold">
                  Sieger: {winnerName}
                </span>

                )}
              </div>
            )}
          </div>
        );
      })}




            </ul>
          ) : (
            <p className="text-gray-500">Keine Matches gefunden.</p>
          )}
        </div>
      </div>
    </div>
  );
}
