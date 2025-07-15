import { useEffect, useState } from "react";
import RainAnimation from "./RainAnimation";
import { useTheme } from "next-themes";
import { useParamsStore } from "../context/parameters";

type Drop = {
    id: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
  };

export default function Background(){
    const [drops, setDrops] = useState<Drop[]>([]);
    const { theme } = useTheme();
    const [dropCount, setdropCount] = useState(0)
    const precipitation = useParamsStore((state)=>state.precipitation)

    const randRange = (minNum:number, maxNum:number) => {
        return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    };

    const createRain = () => {
        const rainDrops = [];
        
        for (let i = 1; i < dropCount; i++) {
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
        let drops = precipitation*250;
        setdropCount(drops)
        createRain();
        const handleResize = () => createRain();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
      }, [dropCount, precipitation]);
    
    return(
        <div className={`h-full rounded-2xl ${theme==="dynamic"? 'bg-background-dynamic':'bg-background'}  overflow-hidden relative`}>
        {theme=="dynamic" && (
        drops.map(drop => (
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
        )))}
    </div>
    )
}