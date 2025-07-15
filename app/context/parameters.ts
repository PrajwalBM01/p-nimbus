import { create } from 'zustand'

interface ParamsState {
    temperature: number,
    precipitation:number,
    setTemperature:(value:number)=>void,
    setPrecipitation:(value:number)=>void
}

export const useParamsStore = create<ParamsState>((set)=>({
    temperature: 0,
    precipitation:0,
    setTemperature:(value)=>set(()=>({temperature:value})),
    setPrecipitation:(value)=>set(()=>({precipitation:value}))
}))