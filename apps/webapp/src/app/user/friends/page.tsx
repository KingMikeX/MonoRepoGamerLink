'use client';
import React, { useEffect, useState } from 'react';
import FullSideBar from '@/components/FullSideBar';
import SendFriendRequest from '@/components/SendFriendRequest';

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
}

export default function FriendsPage() {
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [sent, setSent] = useState<FriendRequest[]>([]);
  const [accepted, setAccepted] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedPage = {
    0: '/user/profile',
    1: '/home',
    2: '/tournements/list',
    3: '/user/friends',
    4: '/games/all',
  };

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const token = localStorage.getItem("token");
        const currentUserId = localStorage.getItem("user_id");

        const [incomingRes, sentRes, acceptedRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/friends/requests/incoming`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/friends/requests/sent`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/friends/list`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const incomingData: FriendRequest[] = await incomingRes.json();
        const sentData: FriendRequest[] = await sentRes.json();
        const acceptedData = await acceptedRes.json(); // PublicUserProfile[]

        const enrich = async (req: FriendRequest) => {
          const senderRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/by-id/${req.sender_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const receiverRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/by-id/${req.receiver_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const sender = senderRes.ok ? await senderRes.json() : {};
          const receiver = receiverRes.ok ? await receiverRes.json() : {};

          return {
            ...req,
            sender_name: sender.username || req.sender_id,
            receiver_name: receiver.username || req.receiver_id,
          };
        };

        const incoming = await Promise.all(incomingData.map(enrich));
        const sent = await Promise.all(sentData.map(enrich));

      const acceptedFormatted: FriendRequest[] = acceptedData.map((user: any) => ({
        id: user.friendship_id,
        sender_id: currentUserId || '',
        receiver_id: user.user_id,
        status: "accepted",
        created_at: "",
        sender_name: "Du",
        receiver_name: user.username,
      }));

        setIncoming(incoming);
        setSent(sent);
        setAccepted(acceptedFormatted);
      } catch (error) {
        console.error("Fehler beim Laden der Freundesdaten:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendData();
  }, []);

  const handleAccept = async (requestId: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/friends/accept/${requestId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    location.reload();
  };

  const handleDecline = async (requestId: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/friends/decline/${requestId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    location.reload();
  };

  return (
    <div className="flex bg-[#252641]" >
      <FullSideBar which_Page={selectedPage[3]} />

      <div className="flex-1 p-10 text-white">


        {loading ? (
          <p>Lade Freundesdaten...</p>
        ) : (
          <>
            
            <div className="mb-8">
              <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4 uppercase">Freund hinzufügen</h2>
              <SendFriendRequest />
            </div>

            <section className="mb-8">
              <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4 uppercase">Eingehende Anfragen</h2>
              {incoming.length === 0 ? <p>Keine Anfragen.</p> : (
                <ul className="space-y-3">
                  {incoming.map(req => (
                    <li key={req.id} className="bg-[#121428] p-4 rounded-xl flex justify-between items-center">
                      <span>{req.sender_name}</span>
                      <div className="space-x-2">
                        <button onClick={() => handleAccept(req.id)} className="bg-green-600 hover:bg-green-800 rounded-xl font-semibold px-3 py-1 rounded uppercase">Annehmen</button>
                        <button onClick={() => handleDecline(req.id)} className="bg-red-600 hover:bg-red-800 rounded-xl font-semibold px-3 py-1 rounded uppercase">Ablehnen</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mb-8">
              <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4 uppercase">Gesendete Anfragen</h2>
              {sent.length === 0 ? <p>Keine gesendeten Anfragen.</p> : (
                <ul className="space-y-3">
                  {sent.map(req => (
                    <li key={req.id} className="bg-[#121428] p-4 rounded-xl">
                      <span>an {req.receiver_name} gesendet</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-[#FF4EF1] text-xl font-semibold border-b border-[#2E314A] pb-2 mb-4 uppercase">Akzeptierte Freunde</h2>
              {accepted.length === 0 ? <p>Keine Freunde.</p> : (
                <ul className="space-y-3">
                  {accepted.map(req => (
                    <li key={req.id} className="bg-[#121428] p-4 rounded-xl flex justify-between items-center">
                      <span>{req.receiver_name}</span>
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem("token");
                          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/friends/remove/${req.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          location.reload(); // aktualisieren
                        }}
                        className="bg-red-600 hover:bg-red-800 rounded-xl text-white font-semibold px-3 py-1 rounded uppercase"
                      >
                        Entfernen
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
