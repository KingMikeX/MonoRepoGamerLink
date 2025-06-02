'use client';

import React, { useEffect, useState } from 'react';
import FullSideBar from '@/components/FullSideBar';
import HomeShortCutPanel from '@/components/HomeShortCutPanel';
import SimplePost from '@/components/SimplePost';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [joinedTournaments, setJoinedTournaments] = useState<any[]>([]);
  const [createdTournaments, setCreatedTournaments] = useState<any[]>([]);
  const [friendActivities, setFriendActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [joinedRes, createdRes, profileRes, friendRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem(`token`)}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/created-by-me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem(`token`)}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem(`token`)}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/activities`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        const joinedData = await joinedRes.json();
        const createdData = await createdRes.json();
        const friendActivityData = await friendRes.json();

        setJoinedTournaments(joinedData ?? []);
        setCreatedTournaments(createdData ?? []);
        setFriendActivities(Array.isArray(friendActivityData) ? friendActivityData : []);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedPage = {
    0: '/user/profile',
    1: '/home',
    2: '/tournaments/list',
    3: '/user/friends',
    4: '/games/all',
  };

  const renderPosts = () => {
    const allPosts = [
      ...joinedTournaments.map(t => ({
        type: 'joined' as const,
        content: `Beigetreten zu "${t.name}"`,
        date: new Date(t.joined_at || t.created_at || t.date),
      })),
      ...createdTournaments.map(t => ({
        type: 'created' as const,
        content: `Erstellt: "${t.name}"`,
        date: new Date(t.created_at || t.date),
      })),
      ...friendActivities.map(a => ({
        type: a.type as 'joined' | 'created',
        content: `${a.username} ${a.type === 'joined' ? 'ist beigetreten zu' : 'hat erstellt'}: "${a.tournament}"`,
        date: new Date(a.date),
      })),
    ];

    allPosts.sort((a, b) => b.date.getTime() - a.date.getTime());

if (allPosts.length === 0) {
    return (
      <div className="mt-10 text-center text-gray-400">
        <p>Dein Feed ist aktuell leer.</p>
        <p>Erstelle ein Turnier oder tritt einem bei, um Aktivitäten zu sehen!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      {allPosts.map((post, index) => (
        <SimplePost key={index} content={post.content} type={post.type} date={post.date} />
      ))}
    </div>
  );
  }

  return (
    <div className="bg-[#252641] flex max-h-screen">
      <FullSideBar which_Page={selectedPage[1]} />
      <div className="flex flex-1">
        <main className="flex-1 mr-20 ml-20 overflow-y-scroll no-scrollbar">
          {loading ? (
            <p className="text-white mt-6">Lade personalisierten Feed...</p>
          ) : (
            renderPosts()
          )}
        </main>
        <HomeShortCutPanel />
      </div>
    </div>
  );
}
