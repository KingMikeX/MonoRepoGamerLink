"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FullSideBar from "@/components/FullSideBar";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

interface ProfileState {
  image?: string;
  username: string;
  about: string;
  location: string;
  birthdate: string;
  games: string[];
  platform: string;
  playstyle: string;
  languages: string[];
  discord: string;
  steam: string;
  twitch: string;
  youtube: string;
}

export default function ProfileViewPage() {
const params = useParams();
const user_id = params?.["user_id"] as string;
  const [profile, setProfile] = useState<ProfileState | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profile/view/${user_id}`);
        if (!res.ok) throw new Error("Profil nicht gefunden");

        const data = await res.json();
        setProfile({
          username: data.username,
          about: data.bio || "",
          location: data.region || "",
          birthdate: data.birthdate || "",
          games: data.favorite_games || [],
          platform: data.platform || "",
          playstyle: data.play_style || "",
          languages: data.languages || [],
          discord: data.discord || "",
          steam: data.steam || "",
          twitch: data.twitch || "",
          youtube: data.youtube || "",
          image: data.profile_picture || "",
        });
      } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
      }
    };

    if (user_id) fetchProfile();
  }, [user_id]);

  if (!profile) {
    return <div className="text-white p-10">Lade öffentliches Profil...</div>;
  }

  return (
    <div className="min-h-screen flex font-sans text-white bg-[#252641]">
      <FullSideBar which_Page={null} />
      <main className="flex-1 overflow-y-auto px-8 py-10 space-y-16">
        <h1 className="text-2xl font-bold text-white mb-6">{profile.username}'s Öffentliches Profil</h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-[#da4ecc] text-sm font-bold mb-1">Über mich</h2>
            <p className="bg-[#1A1C2D] p-4 rounded-md">{profile.about || "Keine Angaben"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold">Standort</h3>
              <p className="bg-[#1A1C2D] p-2 rounded-md">{profile.location || "Keine Angabe"}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold">Geburtsdatum</h3>
              <p className="bg-[#1A1C2D] p-2 rounded-md">{profile.birthdate || "Keine Angabe"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Lieblingsspiele</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.games.length > 0 ? profile.games.map((game, i) => (
                <span key={i} className="bg-[#2A2C3E] px-3 py-1 rounded-full text-xs">{game}</span>
              )) : <p className="text-gray-400">Keine Angaben</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold">Plattform</h3>
              <p className="bg-[#1A1C2D] p-2 rounded-md">{profile.platform || "Keine Angabe"}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold">Spielstil</h3>
              <p className="bg-[#1A1C2D] p-2 rounded-md">{profile.playstyle || "Keine Angabe"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Sprachen</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.languages.length > 0 ? profile.languages.map((lang, i) => (
                <span key={i} className="bg-[#2A2C3E] px-3 py-1 rounded-full text-xs">{lang}</span>
              )) : <p className="text-gray-400">Keine Angaben</p>}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Socials</h3>
            <ul className="list-disc pl-6">
              {profile.discord && <li>Discord: {profile.discord}</li>}
              {profile.steam && <li>Steam: {profile.steam}</li>}
              {profile.twitch && <li>Twitch: {profile.twitch}</li>}
              {profile.youtube && <li>YouTube: {profile.youtube}</li>}
              {!profile.discord && !profile.steam && !profile.twitch && !profile.youtube && (
                <li className="text-gray-400">Keine Angaben</li>
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
