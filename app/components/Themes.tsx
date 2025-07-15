import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { IconSunFilled } from "@tabler/icons-react"

export default function Themes(){
    const [isThemeOpen, setisThemeOpen] = useState(false)

    const themesList:object[] = [
        {  
            id:1,
            theme:'light',
            icon:IconSunFilled,
            

        }
    ]

    return (
        <div onClick={()=>setisThemeOpen(prev=>!prev)} className="relative">
            <AnimatePresence>
            {isThemeOpen? (
                <motion.div className=" size-8 relative " >
                    <motion.div layout className=" border absolute rounded-full size-8 bg-backBackground border-borderColor">1</motion.div>
                    <motion.div layout className=" border absolute rounded-full size-8 bg-backBackground border-borderColor">2</motion.div>
                    <motion.div layout className=" border absolute rounded-full size-8 bg-backBackground border-borderColor">3</motion.div>
                    <motion.div layout className=" border absolute rounded-full size-8 bg-backBackground border-borderColor">4</motion.div>
                </motion.div>
            ):(
            <motion.div className="grid grid-cols-2 grid-rows-2 gap-2">
                <motion.div layout className="border rounded-full size-8 bg-backBackground border-borderColor">1</motion.div>
                <motion.div layout className="border rounded-full size-8 bg-backBackground border-borderColor">2</motion.div>
                <motion.div layout className="border rounded-full size-8 bg-backBackground border-borderColor">3</motion.div>
                <motion.div layout className="border rounded-full size-8 bg-backBackground border-borderColor">4</motion.div>
            </motion.div>
            )}
            </AnimatePresence>
        </div>
    )
}