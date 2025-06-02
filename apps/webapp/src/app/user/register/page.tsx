"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Console } from "console";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setError(null);
  
    if (!username || !isValidEmail(email) || password.length < 6) {
      setError("Bitte gib einen Benutzernamen, eine gültige E-Mail und ein Passwort (mind. 6 Zeichen) ein.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registrierung fehlgeschlagen.");
      }
  
      const data = await res.json();
      console.log("angekommen");
  
      // ✅ HIER: Token speichern!
      localStorage.setItem("token", data.access_token);
  
      // ✅ danach weiterleiten zur Homepage
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121428] text-white px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center mb-2">
          <img
            src="/logo.webp"
            alt="GamerLink Logo"
            className="mx-auto h-33 w-200"
          />
          <p className="uppercase tracking-widest text-sm font-black text-white mb-6">
            Registrierung
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#1E2035] text-white font-semibold placeholder-white px-4 py-2 rounded-md border border-[#2d2f46] focus:outline-none focus:ring-2 focus:ring-[#D047FF]"
            required
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1E2035] text-white font-semibold placeholder-white px-4 py-2 rounded-md border border-[#2d2f46] focus:outline-none focus:ring-2 focus:ring-[#D047FF]"
            required
          />
          <input
            type="password"
            placeholder="Passwort (min. 6 Zeichen)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1E2035] text-white placeholder-white font-semibold px-4 py-2 rounded-md border border-[#2d2f46] focus:outline-none focus:ring-2 focus:ring-[#D047FF]"
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="text-sm text-center font-semibold text-gray-300">
            Du hast schon ein Konto?{" "}
            <Link href="/user/login" className="text-[#da4ecc] hover:underline font-medium">
              Login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full py-2 bg-[#dd17c9] hover:bg-[#da4ecc] text-white font-semibold rounded-md transition"
          >
            {loading ? "Lade..." : "Registrieren"}
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-xs text-center font-semibold text-gray-400 mt-4">
          Ich stimme den{" "}
          <a href="#" className="underline">Nutzungsbedingungen</a> und der{" "}
          <a href="#" className="underline">Datenschutzerklärung</a> zu.
        </p>
      </div>
    </div>
  );
}
