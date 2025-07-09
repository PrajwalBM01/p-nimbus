import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { tool as createTool, generateObject, generateText } from 'ai';
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
                    }),
                    detailedInfo:z.string().describe('A small detialed weather report within 4-5 lines which cover most important information.')
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

export const genrateUiComp = createTool({
    description: 'Genrate a tsx weather card react component, run this function if there is a tool-call with disaplyWether',
    parameters: z.object({
        formatedResultString:z.string().describe('This is a result of disaplyWeather tool call which will be in object and will taken as a string value which as an object with weather information'),
    }),
    execute: async({formatedResultString})=>{
        console.log("wea are reachhing the ui componnet")
        const weatherCardUi = await generateText({
            model:google('gemini-2.5-flash'),
            system: `
            YOU ARE A REACT FUNCTIONAL COMPONENT GENERATOR SPECIALISED IN CREATING STUNNING, WEATHER-THEMED UI FUNCTION COMPONENTS. YOUR TASK IS TO GENERATE PURE TSX FUNCTION COMPONENT (START WITH EXPORT DEFAULT FUNCTION WEATHERUI(){ AND END WITH } NOTHING ELSE, EXCEPT THE DESIGN AND DATA INSIDE THE FUNCTION COMPONENT.)
            - STRICT GUIDELINE: STRICTLY DO NOT USE CONDITIONAL CLASS ASSIGNMENT OR CONDITIONAL CLASS NAMES LIKE \${}.

            - OBJECTIVE: GENERATE A SINGLE TSX REACT FUNCTIONAL COMPONENT WITH EXPORT DEFAULT FUNCTION WEATHERUI(){ }, NO IMPORTS OR NO PROPS. AND IT WILL HAVE THE DATA PROVIDED AS AN OBJECT, EXTRACT IT AND USE IT TO DISPLAY AND CREATE VISUALLY REPRESENTING WEATHER CARD BASED ON THE DATA PROVIDED.

            - INPUT DATA: THE INPUT DATA WILL BE AN OBJECT IN STRING FORMAT WHICH WILL HAVE WEATHER DETAILS IN IT. YOU NEED TO EXTRACT THE VALUES AND DISPLAY THEM. AND WILL CONTAIN:
            - LOCATION: OBJECT WITH CITY, COUNTRY, REGION
            - LOCALTIME: OBJECT WITH TIME, DATE, DAY
            - WEATHERDETAILS: OBJECT WITH WEATHER, TEMPERATURE, WIND, HUMIDITY, PRECIP

            - VISUAL LAYOUT SPECS:
            - CARD SIZE: 500PX WIDTH AND 200PX HEIGHT
            - CARD DIVISION:
                - UPPER DIVISION (COVERING 5/6TH OF THE CARD):
                    - TOP LEFT: WEATHER, TEMPERATURE, WIND, HUMIDITY, PRECIP (VERTICALLY ONE BELOW THE OTHER). USE KEY-VALUE PAIR DISPLAY FOR WIND, HUMIDITY, AND PRECIP ONLY. DO NOT USE KEY-VALUE FOR TEMPERATURE AND WEATHER.
                    - TOP RIGHT: TIME, DATE, DAY (VERTICALLY ONE BELOW THE OTHER). DO NOT USE KEY-VALUE DISPLAY. JUST DISPLAY THE VALUE.
                - LOWER DIVISION (COVERING 1/6TH OF THE CARD):
                    - BOTTOM RIGHT OF THE CARD: CITY, REGION, COUNTRY (DISPLAYED IN HORIZONTAL LINE ONE AFTER THE OTHER). DO NOT USE KEY-VALUE DISPLAY. ALIGN TO BOTTOM LEFT, SEPARATED BY SOME SPACE.

            - DESIGN AND STYLING:
            - USE ONLY TAILWIND CSS CLASSES.
            - NO ANIMATION, NO TRANSITION.
            - USE PROPER PADDING, SPACING AND WHITE SPACES.
            - CARD SHOULD BE ROUNDED-2XL, SHADOW-SM, NO BORDER, MINIMALISTIC LOOK WITH WEATHER-BASED GRADIENT BACKGROUNDS.
            - TYPOGRAPHY:
                - TEMPERATURE: BOLD AND BIG
                - SMALL FONT SIZE FOR LOCAL TIME
                - EXTRA SMALL SIZE FOR LOCATION
                - EXTRA SMALL SIZE FOR WEATHER DETAILS
                - ALL TEXT SHOULD BE WHITE COLOURED AND CAPITALIZED
                - USE DEGREE C SYMBOL FOR TEMPERATURE

            - WEATHER THEMING IDEAS OR EXAMPLES:
            - SUNNY WEATHER: RED TO ORANGE GRADIENT WITH YELLOW HIGHLIGHTS, SUN-LIKE ILLUSION USING DIV FULL ROUNDED
            - RAINY WEATHER: DARK GRAYS WITH SUBTLE BLUE GRADIENTS, RAIN DROPLETS ILLUSION BASED ON PRECIPITATION, CLOUDS
            - CLOUDY WEATHER: DEEP NAVY BLUE WITH YELLOW AND LIGHTER BLUE ACCENTS, CLOUD-LIKE ILLUSION USING OVERLAPPING ROUNDED DIVS
            - NIGHT TIME: DARK BACKGROUNDS, STARS, MOON ELEMENTS USING DIVS
            - COLD SNOWY LOW TEMP: COOL BLUES, WHITES, ICY EFFECTS, SNOW-LIKE STYLE
            - HOT SUNNY HIGH TEMPERATURE: WARM REDS, ORANGES, HEAT SHIMMER EFFECTS

            # YOU MUST FOLLOW THIS STRUCTURED APPROACH TO GENERATE THE COMPONENT:
            1. UNDERSTAND THE INPUT DATA STRUCTURE AND WEATHER CONDITION
            2. IDENTIFY WHICH VISUAL THEME TO APPLY BASED ON WEATHER AND DO NOT APPLY ANY CONDITIONAL RENDERING
            3. OUTPUT ONLY TSX FUNCTIONAL COMPONENT AND NOTHING ELSE
            4. STYLE EACH BLOCK WITH TAILWIND CLASSES FOR SPACING, SIZE, FONT WEIGHT, AND ALIGNMENT
            5. CREATE SMALL DIV ELEMENTS FOR WEATHER EFFECTS (E.G., SUN, RAIN, CLOUDS, MOON, SNOW)
            6. MAKE SURE EVERYTHING STAYS INSIDE THE CARD AND NOTHING GOES OUTSIDE IT

            # REVIEW TO ENSURE:
            - NO ANIMATIONS
            - PURE TSX WITH PROPER TAILWIND CLASSES ONLY
            - CARD IS WITHIN 500PX WIDTH AND 200PX HEIGHT
            - VISUAL POLISH AND CONSISTENCY
            - DO NOT USE ANY CONDITIONAL RENDERING OR \\ THIS ANNOTATION IN CLASSNAME. JUST USE DOUBLE QUOTES OR SINGLE QUOTES
            - STRICTLY ADHERE THAT YOU SHOULD NOT USE CONDITIONAL CLASS ASSIGNMENT OR CONDITIONAL CLASS NAMES LIKE \${}
            - MAKE SURE THE HTML ELEMENTS ARE PROPERLY OPENED AND CLOSED
            - MAKE SURE THE STYLING CLASSES ARE PROPERLY OPENED AND CLOSED
            `,
            prompt:JSON.stringify(formatedResultString)
        })
        console.log(weatherCardUi.text)
        console.log(weatherCardUi)
        return weatherCardUi
    }   
})

export const tools = {
  displayWeather: weatherTool,
//   reactComponentGenrator: genrateUiComp,
};