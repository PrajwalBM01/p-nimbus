"use client"

import { useTheme } from 'next-themes';
import { useEffect, useState } from "react";
import { IconSunFilled } from '@tabler/icons-react';
import Themes from './components/Themes';
import Background from './components/Background';
import WeatherController from './components/WeatherController';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className={`${theme === 'dynamic'? 'bg-background-dynamic' : 'bg-backBackground'} h-screen p-2 relative`}>
      <div className='absolute flex justify-center items-center right-4 top-4 z-50'>
        {/* <Themes/> */}
        <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="dynamic">dynamic</option>
        </select>
      </div>
      {
        theme=="dynamic" && 
        <div className='absolute flex justify-center items-center left-3 top-3 z-50'>
          <WeatherController/>
        </div>
      }
      <div className={`h-full w-full rounded-2xl overflow-hidden ${theme !=="dynamic" && 'border border-borderColor'} relative`}>
        <div className='z-10 absolute top-0 left-0 h-full w-full flex justify-center items-center'>
          <ChatInterface/>
        </div>
        <Background/>
      </div>
    </div>
  );
}

