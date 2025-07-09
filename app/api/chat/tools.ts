import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { tool as createTool, generateObject } from 'ai';
import axios from 'axios';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
    apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY
  });

  
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
            const formatedResult = await generateObject({
                model: google('gemini-2.5-flash'),
                system:`You are a highly specialized data extraction and formatting AI. Your sole function is to recive a single text containing weather inforamtoin and convert it into a precise JSON formate provided in the schema.
                      Instructions: you will be given a twxt which contains weather information and all measurments will be in metric units.
                      You must genrate an object who's scheme is provided. DO NOT include any extra information, extra text, explanations, greetings, or markdown code fences (like \`\`\`json).
                      Adhere strictly to the JSON structure and data formatting rules provided in the schema `,
                schema: z.object({
                    location:z.object({
                        city:z.string().describe("a string value which tells the name of the city"),
                        country:z.string().describe("a string value which tells the name of the country"),
                        region:z.string().describe("a string value which tells the name of the region")
                    }),
                    localTime:z.object({
                        time:z.string().describe("String in 24-hour format (e.g., '14:30')"),
                        date:z.string().describe("String formatted exactly as 'DD Month YYYY' (e.g., '05 July 2025')"),
                        day:z.string().describe("String of the full day name (e.g., 'Saturday')")
                    }),
                    WeatherDeatils:z.object({
                        weather:z.string().describe('A string with a maximum of two words (e.g., "Partly Cloudy", "Light Rain")'),
                        temperature:z.number().describe("A numerical value for the temperature in Celsius."),
                        wind:z.string().describe("A string value for the wind speed in km/h, along with the units"),
                        humidity:z.string().describe("A string value for the humidity percentage, along with the %unit"),
                        precp:z.string().describe("A string value for the precipitation in millimeters, along with the units")
                    })
                }),
               prompt:JSON.stringify(repsonse.data)
                
            })
            return formatedResult.object
        }
    }catch(e){
        return "Somthing went wrong"
    }
  }
});

export const tools = {
  displayWeather: weatherTool,
};