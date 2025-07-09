import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createDataStreamResponse, generateText, streamText } from 'ai';
import { tools } from './tools';

const google = createGoogleGenerativeAI({
  apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

interface UicomponentAnnotation {
    type: string;
    value: string;
  }

export async function POST(req: Request) {
    const {messages} = await req.json();
    console.log(messages)
    try{
        return createDataStreamResponse({
            execute: async (dataStream) => { 
                const result = streamText({
                    model: google('gemini-2.0-flash'),
                    system: 'You are a helpful and conversational AI assistant. Use the provided tools only when it is essential to answer the user\'s question or fulfill their request and do not tell them tahat you can only do what the tools are capable of. Otherwise, provide a clear, concise, and direct natural language response.', 
                    messages,
                    tools,
                    maxSteps:3,
                    onStepFinish: async (stepResult) => { 
                        if (stepResult.toolCalls && stepResult.toolCalls.some(call => call.toolName === 'displayWeather')) {
                            const weatherTool = stepResult.toolCalls.find(call=>call.toolName === 'displayWeather')
                            const weatherToolId = weatherTool?.toolCallId;
                            const weatherToolResults = stepResult.toolResults.find(call=>call.toolCallId === weatherToolId);
                            const weatherCardUi = await generateText({
                                model:google('gemini-2.0-flash'),
                                system: `YOU ARE A REACT FUNCTIONAL COMPONENT GENERATOR SPECIALISED IN CREATING STUNNING, WEATHER-THEMED UI FUNCTION COMPONENTS. YOUR TASK IS TO GENERATE PURE TSX FUNCTION COMPONENT.
                                    - STRICT GUIDELINE: STRICTLY DO NOT USE CONDITIONAL CLASS ASSIGNMENT OR CONDITIONAL CLASS NAMES LIKE \${} DO NOT USE TEMPLETE LITERAL, AND INTEROLATION, TEMPLATE LITRAL INTERPOLATION WHILE STYLING USING TAILWINDCSS CLASSES.
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
                                        - USE ONLY TAILWIND CSS CLASSES,DO NOT USE TEMPLETE LITERAL, AND INTEROLATION, TEMPLATE LITRAL INTERPOLATION WHILE STYLING USING TAILWIND CSS CLASSES.
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
                                        - AND BEAWARE OF THE TIME>LIKE SEE IF ITS NIGHT OR DAY.

                                    # YOU MUST FOLLOW THIS STRUCTURED APPROACH TO GENERATE THE COMPONENT:
                                    1. UNDERSTAND THE INPUT DATA STRUCTURE AND WEATHER CONDITION
                                    2. IDENTIFY WHICH VISUAL THEME TO APPLY BASED ON WEATHER AND DO NOT APPLY ANY CONDITIONAL RENDERING
                                    3. OUTPUT ONLY TSX FUNCTIONAL COMPONENT AND NOTHING ELSE
                                    4. STYLE EACH BLOCK WITH TAILWIND CLASSES FOR SPACING, SIZE, FONT WEIGHT, AND ALIGNMENT
                                    5. CREATE SMALL DIV ELEMENTS FOR WEATHER EFFECTS (E.G., SUN, RAIN, CLOUDS, MOON, SNOW)
                                    6. MAKE SURE EVERYTHING STAYS INSIDE THE CARD AND NOTHING GOES OUTSIDE IT

                                    - STRICTLY PROHIBATED:
                                        - DO NOT USE backticks (\) anywhere in JSX, not even for className.
                                        - DO NOT USE template literals or \${} for dynamic class assignment or inline styles.
                                        - DO NOT ASSIGN TSX OR TAILWIND CLASSES to variables like const cardBgclass or const weathereffects
                                        - DO NOT USE any use any conditional logic, variable-based TSX, or pre-computed TSX.
                                        -ALL TSX and Tailwind class styling must be directly written inside TSX using static double quotes.
                                        - If a class needs to be repeated, repeat it manually. DO NOT use a variable.

                                    # REVIEW TO ENSURE:
                                    - NO ANIMATIONS
                                    - PURE TSX WITH PROPER TAILWIND CLASSES ONLY.
                                    - CARD IS WITHIN 500PX WIDTH AND 200PX HEIGHT
                                    - VISUAL POLISH AND CONSISTENCY
                                    - DO NOT USE ANY CONDITIONAL RENDERING OR \\ THIS ANNOTATION IN CLASSNAME. JUST USE DOUBLE QUOTES OR SINGLE QUOTES
                                    - DO NOT USE TEMPLETE LITERAL, AND INTEROLATION, TEMPLATE LITRAL INTERPOLATION WHILE STYLING USING TAILWINDCSS CLASSES.
                                    - STRICTLY ADHERE THAT YOU SHOULD NOT USE CONDITIONAL CLASS ASSIGNMENT OR CONDITIONAL CLASS NAMES LIKE \${}
                                    - MAKE SURE THE HTML ELEMENTS ARE PROPERLY OPENED AND CLOSED
                                    - MAKE SURE THE STYLING CLASSES ARE PROPERLY OPENED AND CLOSED
                                    - NEVER NEVER USE CONDITIONAL LOGIC OR CLASS ASSIGNMENTS, IF YOU HAVE TO REPEAT A STYLE DO IT BUT DONT USE ANNOTAION IN THE CODE.`,
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