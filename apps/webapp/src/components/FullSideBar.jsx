"use client"

import React from 'react';
import { User, Users, Gamepad2, Swords, Zap } from 'lucide-react';
import Sidebar, { SidebarItem } from '@/components/Sidebar';
import { useRouter } from 'next/navigation';

export default function FullSideBar({which_Page}) {
  const router = useRouter()

  const goToProfil = () => {
    router.push('/user/profil')
  }

  const goToTournaments = () => {
    router.push('/tournements/list')
  }

  const goToFriends = () => {
    router.push('/user/friends')
  }

  const goToGames = () => {
    router.push('/games/all')
  }

  const goToFeed = () => {
    router.push('/home')
  }

  const goToSubscribe = () => {
  router.push('/user/subscribe');
  }


  var selectedPage = {
    '/user/profile': 0,
    '/home': 1,
    '/tournements/list': 2,
    '/user/friends': 3,
    '/games/all': 4,
    '/user/subscribe': 5,
  }

  function is_page_selected(open_page, forwarding_page_number){
    if(open_page == forwarding_page_number)
      return true
    else return false
  }

if(which_Page == 0)re
  return (
    <aside className="hidden top-0 left-0 z-10 md:flex">
    <div className="bg-[#121428] border-gray-800 border-t">
        <Sidebar>
        <SidebarItem icon={<User size={20} />} text="Profil" active onClick={goToProfil} selected={is_page_selected(selectedPage[which_Page], 0)}/>
        <SidebarItem icon={<Zap size={20} />} text="Feed" active onClick={goToFeed} selected={is_page_selected(selectedPage[which_Page], 1)}/>
        <SidebarItem icon={<Swords size={20} />} text="Tournaments" active onClick={goToTournaments} selected={is_page_selected(selectedPage[which_Page], 2)}/>
        <SidebarItem icon={<Users size={20} />} text="Friends" active onClick={goToFriends} selected={is_page_selected(selectedPage[which_Page], 3)}/>
        <SidebarItem icon={<Gamepad2 size={20} />} text="Subscribe" active onClick={goToSubscribe} selected={is_page_selected(selectedPage[which_Page], 5)}/>
        </Sidebar> 
    </div>
    </aside>
  );
}