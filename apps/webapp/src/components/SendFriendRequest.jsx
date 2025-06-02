'use client';
import React, { useState } from 'react';

export default function SendFriendRequest() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const sendRequest = async () => {
    try {
      // Erst die ID anhand des Usernamens abrufen
      const profileRes = await fetch(`http://localhost:8000/profile/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!profileRes.ok) {
        setMessage('Benutzer nicht gefunden');
        return;
      }

      const profileData = await profileRes.json();
      const receiverId = profileData.user_id || profileData.id;

      // Anfrage senden
      const res = await fetch('http://localhost:8000/profile/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ receiver_id: receiverId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Anfrage gesendet');
      } else {
        if (Array.isArray(data.detail)) {
          const firstError = data.detail[0]?.msg || 'Fehler beim Senden.';
          setMessage(firstError);
        } else {
          setMessage(data.detail || 'Fehler beim Senden.');
        }
      }
    } catch (error) {
      console.error('Fehler:', error);
      setMessage('Netzwerkfehler');
    }
 
  };

  return (

    <div className="bg-[#121428] p-4 rounded-lg shadow-md w-full max-w-md">
      
      <input
        type="text"
        placeholder="Benutzernamen eingeben"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-2 rounded bg-[#252641] text-white"
      />
      <button
        onClick={sendRequest}
        className="bg-[#dd17c9] hover:bg-[#aa0d9d] text-white font-semibold rounded-xl transition-colors py-2 px-4 rounded w-full uppercase"
      >
        Anfrage senden
      </button>
      {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
    </div>
  );
}
