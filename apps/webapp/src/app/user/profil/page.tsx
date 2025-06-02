"use client";
import FullSideBar from "@/components/FullSideBar";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`; // Passe ggf. deine URL an

// Typdefinition für den Profile-Zustand
interface ProfileState {
  image?: string;
  username: string;
  email: string;
  about: string;
  location: string;
  birthdate: string;
  games: string[];
  newGame: string;
  platform: string;
  playstyle: string;
  languages: string[];
  newLanguage: string;
  discord: string;
  steam: string;
  twitch: string;
  youtube: string;
  privacy: {
    public: boolean;
    online: boolean;
    emailNotifications: boolean;
    friendRequests: boolean;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileState>({
    image: "",
    username: "",
    email: "",
    about: "",
    location: "",
    birthdate: "",
    games: [],
    newGame: "",
    platform: "",
    playstyle: "",
    languages: [],
    newLanguage: "",
    discord: "",
    steam: "",
    twitch: "",
    youtube: "",
    privacy: {
      public: false,
      online: false,
      emailNotifications: false,
      friendRequests: false,
    },
  });

  var selectedPage = {
    0: '/user/profile',
    1: '/home',
    2: '/tournements/list',
    3: '/user/friends',
    4: '/games/all',
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Kein Token gefunden.");
        return;
      }
  
      // Mapping vom Frontend-zu-Backend-Feldnamen
      const payload = {
        bio: profile.about,
        region: profile.location,
        birthdate: profile.birthdate || null,
        favorite_games: profile.games,
        platform: profile.platform,
        play_style: profile.playstyle,
        languages: profile.languages,
        discord: profile.discord,
        steam: profile.steam,
        twitch: profile.twitch,
        youtube: profile.youtube,
        is_public: profile.privacy.public,
        is_online: profile.privacy.online,
        allow_notifications: profile.privacy.emailNotifications,
        allow_friend_requests: profile.privacy.friendRequests,
        profile_picture: profile.image || undefined, // optional
      };
  
      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Fehler beim Speichern:", errorData);
        alert("Fehler beim Speichern: " + (errorData.detail || "Unbekannter Fehler"));
        return;
      }
  
      const result = await response.json();
      console.log("Profil gespeichert:", result);
      alert("Profil erfolgreich gespeichert!");
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Es ist ein Fehler beim Speichern aufgetreten.");
    }
  };
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const res = await fetch(`${API_BASE_URL}/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          throw new Error("Profil konnte nicht geladen werden");
        }
  
        const data = await res.json();
  
        setProfile((prev) => ({
          ...prev,
          username: data.username || prev.username, // falls du es im Backend ergänzt hast
          email: data.email || "", // optional, falls nicht im Profil enthalten
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
          privacy: {
            public: data.is_public ?? false,
            online: data.is_online ?? false,
            emailNotifications: data.allow_notifications ?? false,
            friendRequests: data.allow_friend_requests ?? false,
          },
        }));
      } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
      }
    };
  
    fetchProfile();
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGame = () => {
    if (profile.newGame.trim()) {
      setProfile((prev) => ({
        ...prev,
        games: [...prev.games, prev.newGame.trim()],
        newGame: "",
      }));
    }
  };

  const handleRemoveGame = (gameToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      games: prev.games.filter((game) => game !== gameToRemove),
    }));
  };

  const handleAddLanguage = () => {
    if (profile.newLanguage.trim()) {
      setProfile((prev) => ({
        ...prev,
        languages: [...prev.languages, prev.newLanguage.trim()],
        newLanguage: "",
      }));
    }
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang !== langToRemove),
    }));
  };

  return (
    <div className="min-h-screen flex font-sans text-white bg-[#252641]">
      <FullSideBar which_Page={selectedPage[0]}/>


      <main className="flex-1 overflow-y-auto px-8 py-10 space-y-16">

      <div className="w-full flex flex-col items-center mb-10">
        <label htmlFor="profilePicUpload" className="cursor-pointer">
          {profile.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${profile.image}`}
              alt="Profilbild"
              className="w-28 h-28 rounded-full border border-[#555] object-cover hover:opacity-80 transition"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#1A1C2D] flex items-center justify-center text-[#999] hover:opacity-80 transition">
              Kein Bild
            </div>
          )}
        </label>
        <div className="text-lg font-semibold text-white mt-3">{profile.username}</div>

        <input
          id="profilePicUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/upload-picture`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
              });

              if (!res.ok) {
                const err = await res.json();
                alert("Fehler beim Hochladen: " + (err.detail || "Unbekannter Fehler"));
                return;
              }

              const data = await res.json();
              setProfile((prev) => ({ ...prev, image: data.profile_picture }));
            } catch (error) {
              console.error("Upload fehlgeschlagen:", error);
              alert("Fehler beim Hochladen des Bildes.");
            }
          }}
        />
      </div>



        <section id="section-personal">
          <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4">PERSÖNLICHE INFORMATIONEN</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">Benutzername</label>
              <input name="username" value={profile.username} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2  mr-70 rounded-lg" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">E-Mail-Adresse</label>
              <input name="email" value={profile.email} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 mr-70 rounded-md" />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-white mb-2">Über mich</label>
            <textarea name="about" value={profile.about} onChange={handleChange} className="w-full bg-[#1A1C2D] p-4 rounded-md h-28" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">Standort</label>
              <input name="location" value={profile.location} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 mr-70 rounded-md" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">Geburtsdatum</label>
              <input name="birthdate" type="date" value={profile.birthdate} onChange={handleChange} className="bg-[#1A1C2D] mr-70 px-4 py-2 rounded-md" />
            </div>
          </div>
        </section>
        <section id="section-gaming">
          <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4">GAMING-PROFIL</h2>
          <div className="flex flex-col mb-2">
            <label className="text-sm font-semibold text-white mb-2">Lieblingsspiele</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.games.map((game, index) => (
                <span key={index} className="bg-[#2A2C3E] px-3 py-1 rounded-full text-xs">
                  {game} <button onClick={() => handleRemoveGame(game)} className="ml-1 text-pink-400">×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-semibold text-white mb-2">Neues Spiel</label>
            <div className="flex gap-2">
              <input name="newGame" value={profile.newGame} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 rounded-md w-full mr-130" />
              <button onClick={handleAddGame} className="bg-[#dd17c9] hover:bg-[#aa0d9d] font-semibold px-6 py-2 rounded-xl text-xs">HINZUFÜGEN</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">Hauptplattform</label>
              <select name="platform" value={profile.platform} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 rounded-md mr-70">
                <option value="">Bitte wählen</option>
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">Spielstil</label>
              <select name="playstyle" value={profile.playstyle} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 rounded-md mr-70">
                <option value="">Bitte wählen</option>
                <option value="COMPETETIV">COMPETETIV</option>
                <option value="CASUAL">CASUAL</option>
                <option value="KOOP">KOOP</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-white mb-2">Sprachen</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {profile.languages.map((lang, index) => (
                <span key={index} className="bg-[#2A2C3E] px-3 py-1 rounded-full text-xs">
                  {lang} <button onClick={() => handleRemoveLanguage(lang)} className="ml-1 text-pink-400">×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white mb-2">Neue Sprache hinzufügen</label>
            <div className="flex gap-2">
              <input name="newLanguage" value={profile.newLanguage} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 rounded-md w-full mr-130" />
              <button onClick={handleAddLanguage} className="bg-[#dd17c9] hover:bg-[#aa0d9d] font-semibold px-6 py-2 rounded-xl text-xs ml">HINZUFÜGEN</button>
            </div>
          </div>
        </section>

        <section id="section-social">
          <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4">SOCIAL MEDIA & GAMING ACCOUNT</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">Discord</label>
              <input name="discord" value={profile.discord} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 rounded-md" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">Steam</label>
              <input name="steam" value={profile.steam} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 rounded-md" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">Twitch</label>
              <input name="twitch" value={profile.twitch} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 rounded-md" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-white mb-2">YouTube</label>
              <input name="youtube" value={profile.youtube} onChange={handleChange} className="bg-[#1A1C2D] px-4 py-2 rounded-md" />
            </div>
          </div>
        </section>

        <section id="section-privacy">
          <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4">PRIVATSPHÄRE-EINSTELLUNGEN</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={profile.privacy.public} onChange={() => setProfile(p => ({ ...p, privacy: { ...p.privacy, public: !p.privacy.public } }))} className="accent-[#dd17c9] w-5 h-5" />
              <span className="text-white font-semibold">Profil öffentlich sichtbar</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={profile.privacy.online} onChange={() => setProfile(p => ({ ...p, privacy: { ...p.privacy, online: !p.privacy.online } }))} className="accent-[#dd17c9] w-5 h-5" />
              <span className="text-white font-semibold">Online-Status anzeigen</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={profile.privacy.emailNotifications} onChange={() => setProfile(p => ({ ...p, privacy: { ...p.privacy, emailNotifications: !p.privacy.emailNotifications } }))} className="accent-[#dd17c9] w-5 h-5" />
              <span className="text-white font-semibold">E-Mail-Benachrichtigungen erhalten</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={profile.privacy.friendRequests} onChange={() => setProfile(p => ({ ...p, privacy: { ...p.privacy, friendRequests: !p.privacy.friendRequests } }))} className="accent-[#dd17c9] w-5 h-5" />
              <span className="text-white font-semibold">Freundschaftsanfragen erlauben</span>
            </label>
          </div>
        </section>
        <section className="border-t border-[#2E314A] pt-6 mt-10 flex justify-end gap-4">
        <button
        type="button"
        onClick={() => router.push("/home")}
        className="w-full sm:w-auto px-6 py-2 rounded-xl bg-[#1F213A] hover:bg-[#2E314A] text-white font-semibold transition-colors"
      >
        ABBRECHEN
      </button>
        <button onClick={handleSave} className="px-6 py-2 font-semibold rounded-xl bg-[#dd17c9] text-white hover:bg-[#aa0d9d]">ÄNDERUNGEN SPEICHERN</button>

</section>
      </main>
    </div>
  );
}