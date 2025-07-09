import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createDataStreamResponse, generateText, streamText } from 'ai';
import { tools } from './tools';

const google = createGoogleGenerativeAI({
  apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY
});



export async function POST(req: Request) {
    const {messages} = await req.json();
    console.log(messages)
    try{
        return createDataStreamResponse({
            execute: async (dataStream) => { 
                const result = streamText({
                    model: google('gemini-2.5-flash'),
                    system: 'You are a helpful and conversational AI assistant. Use the provided tools only when it is essential to answer the user\'s question or fulfill their request and do not tell them tahat you can only do what the tools are capable of. Otherwise, provide a clear, concise, and direct natural language response.', 
                    messages,
                    tools,
                    maxSteps:3,
                    onStepFinish: async (stepResult) => { 
                        console.log("Step finished. Tool calls:", stepResult.toolCalls);
                        console.log("Step finished. Tool results:", stepResult.toolResults);
                        console.log("Step finished. Processed tool results:", stepResult.toolResults.map(call => call.result));
                        if (stepResult.toolCalls && stepResult.toolCalls.some(call => call.toolName === 'displayWeather')) {
                            const weatherTool = stepResult.toolCalls.find(call=>call.toolName === 'displayWeather')
                            const weatherToolId = weatherTool?.toolCallId;
                            const weatherToolResults = stepResult.toolResults.find(call=>call.toolCallId === weatherToolId);
                            const weatherCardUi = await generateText({
                                model:google('gemini-2.5-flash'),
                                system: `You are a React functional component genrator specilised in creating stunning, weather-themed UI function components. Your task is to genrate pure TSX function component( with export default function WeatherUI(){ } ) for a beautifully designed weather card.
                                - OBJECTIVE: Genrate a single tsx react functional component with export default function WeatherUI(){ }, no imports or no props. and it will have the data provided as an object, extract it and use it to display and create visually representing weather card based on the data provided
                                - INPUT DATA: the input data will be a object in sting formate which will have weather details in it, you need to extract the values and display them. AND WILL CONTAIN LOCATION(OBJECT WITH CITY,COUNTRY,REGION), LOCALTIME(OBJECT WITH TIME,DATE,DAY), WEATHERDETAILS(OBJECT WITH WEATHER,TEMPRATURE,WIND,HUMIDITY,PRECP)
                                - VISUAL LAYOUT SPECS: 
                                    - CARD SIZE : 500px width and 200px height
                                    - CARD DIVISON : 
                                        - UPPER DIVISION( covering 5/6th of the card ) :
                                            - TOP LEFT : WEATHER, TEMPRATURE, WIND, HUMIDITY, PRECEP ( VERTICALY ONE BELOW THE OTHER). USE KEY VALUE PAIR DISAPLY FOR WIND,HUMIDTY AND PRECEP ONLY and not on temprature and weather.
                                            - TOP RIGHT : TIME, DATE, DAY ( VERTICALY ONE BELOW THE OTHER) DO NOT USE KEY VALUE DISPLAY LIKE EG.DAY:MONDAY, JUST USE THE VALUE.
                                        - LOWWER DIVISION ( covering 1/6th of the card ):
                                            - BOTTOM LEFT : CITY, REGION, COUNTRY DO NOT USE KEY VALUE DISPLAY LIKE EG.COUNTRY:INDIA, JUST USE THE VALUE. in horizantal line on after the other, and should be in bottom left, saperated by some space.
                                #DESIGN AND STYLING : 
                                - USE ONLY TAILWIND CSS CLASSES.
                                - NO ANIMATION, NO TRANSITION.
                                - USEPROPER PADDING, SAPCING AND WHITE SPACES.
                                - CARD SHOULD BE ROUNDED-2XL, SHADOW-SM , NO BORDER, MINIMALISTIC LOOK WITH WEATHER BASED GRADIENT BACKGROUNDS.
                                - TYPOGRAPHY : TEMPRATURE SHOULD BE BOLD AND BIG, SMALL FONT SIZE FOR LOCAL TIME, EXTRA SMALL SIZE OF LOCATION, AND SMALL SIZE FOR WEATHER DETIALS. AND ALL CAPIAL WORDS.ALL TEXT SHOULD BE WHITE COLOUR
                                - USE DEGREE C  SYMBOLE FOR TEMPRATURE.
                                - WEATHER THEMING IDEAS OR EXAMPLES: 
                                    - Sunny weather would be Red to orange gradient with yellow highlights, and make a sun like illusion using div full rounded or somthing.
                                    - Rainy weather would be Dark grays with subtle blue gradients, rain droplets depending illusion on the precptaion, and clouds.
                                    - Cloudy weather would be Deep navy blue with yellow and lighter blue accents. with some cloud like illusion using overlapping rounded divs.
                                    - Night time whould be dark backgrounds, stars, moon elements using div or somthing.
                                    - Cold snowy low temp would  have cool blues, whites, icy effects, snow like style.
                                    - Hot sunny high temprature would have warm reds, oranges, heat shimmer effects. 
                                # YOU MUST FOLLOW THIS STRUCTURED APPROACH TO GENERATE THE COMPONENT:
                                1. UNDERSTAND the input data structure and weather condition
                                2. IDENTIFY which visual theme to apply based on weather and do not apply any conditional rendering.
                                3. OUTPU ONLY TSX functional component and nothing else.
                                4. STYLE each block with Tailwind classes for spacing, size, font weight, and alignment
                                5. CREATE small \`div\` elements for weather effects (e.g., sun, rain, clouds, moon, snow)
                                6. make sure evething stays in =sde the card and nothing goes outside it.
                                7. REVIEW to ensure:
                                - NO animations
                                - Pure TSX with proper Tailwind classes only
                                - Card is within 450x150px
                                - Visual polish and consistency
                                - Make sure the html elemnts are properly opened and closed.
                                - make usre the styling classes are opened and closed properly.`,
                                prompt:JSON.stringify(weatherToolResults)
                            })
                            console.log(weatherCardUi.text)
                            dataStream.writeMessageAnnotation({type:'uiComponent', value:weatherCardUi.text});
                        }
                        console.log("Custom data sent as message annotation for this step.");
                    }
                });

                result.mergeIntoDataStream(dataStream);
            },
            onError: (error) => {
                return error instanceof Error ? error.message : String(error);
            },
        });
        
    }catch(e){
        console.log(e)
        return "somthing went wrong"
    }
}