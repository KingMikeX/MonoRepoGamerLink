"use client";

import React, { useEffect, useState } from "react";
import FullSideBar from "@/components/FullSideBar";

export default function SubscribePage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchRole = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Fehler beim Laden des Profils");
      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.error(err);
      setMessage("Fehler beim Laden deiner Rolle.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/subscribe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setMessage(data.message);
      fetchRole();
    } catch (err) {
      console.error(err);
      setMessage("Fehler beim Subscriben.");
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/unsubscribe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setMessage(data.message);
      fetchRole();
    } catch (err) {
      console.error(err);
      setMessage("Fehler beim Unsubscriben.");
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#252641] text-white">
      <FullSideBar which_Page="/user/subscribe" />
      <div className="flex-1 px-10 py-10">
        <h1 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4 uppercase">Dein Abo-Status</h1>

        {loading ? (
          <p>Lade deine Rolle...</p>
        ) : (
          <>
            <p className="text-lg mb-4">
              Aktuelle Rolle:{" "}
              <span className="font-semibold text-[#FF4EF1]">{role}</span>
            </p>

            <p className="text-gray-300 mb-6 ">
              In der Anfangsphase ist das <strong>Subscriben</strong> kostenlos!
              Unterstütze unser Projekt und erhalte exklusive Features.
            </p>

            <div className="flex gap-4">
              <button
                className="bg-[#dd17c9] hover:bg-[#aa0d9d] text-white px-6 py-2 rounded-xl font-semibold uppercase"
                onClick={handleSubscribe}
              >
                Subscribe
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl font-semibold uppercase"
                onClick={handleUnsubscribe}
              >
                Unsubscribe
              </button>
            </div>

            {message && <p className="text-[#39ff14] mt-4">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}
