import { tool as createTool } from 'ai';
import axios from 'axios';
import { z } from 'zod';

export const weatherTool = createTool({
  description:'Get current weather status for provided city name.',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
}),
  execute: async ({location})=>{
    const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API}&query=${location}&units=m`
    try{
        const repsonse = await axios.get(url)
        if(repsonse.status===200){
            return repsonse.data
        }
    }catch(e){
        return "Somthing went wrong"
    }
  }
});

export const tools = {
  displayWeather: weatherTool,
};