"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from 'lucide-react';


const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string) => password.length >= 6;

async function loginUser(email: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login fehlgeschlagen");
  }

  return await response.json();
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!isValidEmail(value) ? "Bitte gib eine gültige E-Mail-Adresse ein." : null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(!isValidPassword(value) ? "Passwort muss mindestens 6 Zeichen lang sein." : null);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    if (!isValidEmail(email)) {
      setEmailError("Bitte gib eine gültige E-Mail-Adresse ein.");
      setLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError("Passwort muss mindestens 6 Zeichen lang sein.");
      setLoading(false);
      return;
    }

    try {
      const userData = await loginUser(email, password);
      localStorage.setItem("token", userData.access_token);
      window.location.href = "/home"; // ⬅️ Zielseite nach Login
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
          <img src="/logo.webp" alt="GamerLink Logo" className="mx-auto h-33 w-200" />
          <p className="uppercase tracking-widest text-sm font-black text-white mb-6">Login</p>
        </div>

        {/* Login-Formular */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full bg-[#1E2035] font-semibold text-white placeholder-white px-4 py-2 rounded-md border ${
              emailError ? "border-red-500" : "border-[#2d2f46]"
            } focus:outline-none focus:ring-2 focus:ring-[#D047FF]`}
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Passwort"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full bg-[#1E2035] text-white font-semibold placeholder-white px-4 py-2 pr-10 rounded-md border ${
                passwordError ? "border-red-500" : "border-[#2d2f46]"
              } focus:outline-none focus:ring-2 focus:ring-[#D047FF]`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

            </button>
          </div>
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <div className="text-sm text-center font-semibold text-gray-300">
            Noch keinen Account?{" "}
            <Link href="/user/register" className="text-[#da4ecc] hover:underline font-medium">
              Registrieren
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !!emailError || !!passwordError}
            onClick={handleLogin}
            className="w-full py-2 bg-[#dd17c9] hover:bg-[#da4ecc] text-white font-semibold rounded-md transition"
          >
            {loading ? "Lade..." : "Login"}
          </button>
        </form>

        <p className="text-xs font-semibold text-center text-gray-400 mt-4">
          Ich stimme den{" "}
          <a href="#" className="underline font-semibold text-[#text-gray-400]">Nutzungsbedingungen</a> und der{" "}
          <a href="#" className="underline font-semibold text-[#text-gray-400]">Datenschutzerklärung</a> zu.
        </p>
      </div>
    </div>
  );
}
