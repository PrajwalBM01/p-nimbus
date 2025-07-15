import React, { useState, useEffect } from 'react';

type Drop = {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
};

const RainAnimation = ({ 
  dropCount = 300,
}) => {
  const [drops, setDrops] = useState<Drop[]>([]);

  const randRange = (minNum:number, maxNum:number) => {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  };


  const createRain = () => {
    const nbDrop = dropCount
    const rainDrops = [];
    
    for (let i = 1; i < nbDrop; i++) {
      const dropLeft = randRange(0, window.innerWidth || 1600);
      const dropTop = randRange(-1000, 1400);
      const animationDelay = randRange(0, 630) / 1000;
      const animationDuration = randRange(500, 800) / 1000; 
      
      rainDrops.push({
        id: i,
        left: dropLeft,
        top: dropTop,
        animationDelay: animationDelay,
        animationDuration: animationDuration
      });
    }
    
    setDrops(rainDrops);
  };

  useEffect(() => {
    createRain();
    
    const handleResize = () => createRain();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [dropCount]); 
  return (
    <div className="h-screen overflow-hidden relative bg-gradient-to-b from-slate-800 to-black">
      <style jsx global>{`
        .rain-drop {
          background: linear-gradient(to bottom, rgba(13,52,58,1) 0%, rgba(255,255,255,0.6) 100%);
          animation: fall linear infinite;
        }
        
        @keyframes fall {
          from {
            transform: translateY(-100vh);
          }
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>

      {drops.map(drop => (
        <div
          key={drop.id}
          className="rain-drop absolute w-px h-20 opacity-70"
          style={{
            left: `${drop.left}px`,
            top: `${drop.top}px`,
            animationDelay: `${drop.animationDelay}s`,
            animationDuration: `${drop.animationDuration}s`
          }}
        />
      ))}
    </div>
  );
};

export default RainAnimation;