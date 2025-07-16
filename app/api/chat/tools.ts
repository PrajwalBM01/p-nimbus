import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { tavily } from '@tavily/core';
import { tool as createTool, generateObject, generateText } from 'ai';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
    apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY
  });

export const search = createTool({
  description: 'Search the web for information, live updates and other factual information,live information.',
  parameters: z.object({
      query:z.string().describe("The query tp search for"),
  }),
  execute: async({
      query
  })=>{
      console.log("we are reaching here")
      const maxResults = 5;
      const client = tavily({ apiKey: process.env.SEARCH_API });
      try{
          const response = await client.search(query,{
              maxResults:maxResults,
              includeImages: true,
              includeAnswer:true,
              includeImageDescriptions: true,
          })
           
          let resultString = JSON.stringify(response.results)
          const cardIndicators = [
            // Data queries
            /\b(weather|temperature|forecast)\b/i,
            /\b(stock|price|ticker|market)\b/i,
            /\b(currency|exchange rate|convert)\b/i,
            
            // Shopping queries
            /\b(buy|purchase|product|price|deal)\b/i,
            /\b(amazon|ebay|walmart|target)\b/i,
            
            // Travel queries
            /\b(flight|hotel|restaurant|book)\b/i,
            /\b(uber|taxi|gas|directions)\b/i,
            
            // Sports queries
            /\b(score|game|match|team|player|sports)\b/i,
            /\b(nfl|nba|mlb|soccer|football)\b/i,
            ];
          const shouldCreateCard = cardIndicators.some(pattern => pattern.test(query)) || cardIndicators.some(pattern=> pattern.test(resultString))
          console.log(shouldCreateCard)
          //result array, image array, answer, shouldCard(boolean)
          const { answer, results, images } = response
          const finalResponse = { searchResult:answer, results, images, shouldCreateCard:shouldCreateCard }
          return finalResponse
      }catch(e){
          console.log("Something went wrong while searching")
          return {"error":"sonthing got error"}
          
      }
  }
})


export const generateUiCard = createTool({
    description:"Generates a UI component based on web search results. Use this tool *only* when the 'searchingTool' has run and returned 'shouldCreateCard: true'. ",
    parameters: z.object({
        searchResult: z.any().describe(
            "The full JSON object returned from the 'searchingTool'. This object contains the original query, answer, results, images, and the 'shouldCreateCard' flag."
          ),
    }),
    execute: async({searchResult})=>{
        console.log("we are reaching the ui component")
        const response = await generateObject({
            model:google("gemini-2.5-flash"),
            schema:z.object({
                componentCode:z.string()
            }),
            system : `
            YOU ARE A WORLD-CLASS DESIGN ENGINEER SPECIALIZED IN CLEAN COMPONENT ARCHITECTURE AND MODERN DESIGN SYSTEMS USING **REACT + TAILWIND CSS**. YOUR TASK IS TO GENERATE A **PURE FUNCTIONAL REACT COMPONENT IN TSX**, WITH **NO IMPORTS, NO EXPORTS, NO LIBRARIES** IN A STRING FORMATE.

            ### OUTPUT FORMAT RULES:
            - OUTPUT MUST BEGIN WITH: \`\`\` (three backticks)
            - THE FUNCTION MUST BE DECLARED AS: function UiCard() {
            - MUST END WITH A CLOSING BRACE AND THREE BACKTICKS: } \`\`\`
            - DO NOT WRAP JSX IN STRINGS OR CONCATENATE STRINGS
            - DO NOT ESCAPE CHARACTERS ('\n', ''', '"', backticks) OR USE '+'
            - OUTPUT MUST BE A FULLY FORMATTED, MULTILINE TSX FUNCTION IN STRING FORMATE

            ### CONTENT INTERPRETATION LOGIC:
            1. ANALYZE THE CONTEXT MESSAGE TO UNDERSTAND DATA AND IMAGERY
            2. DETERMINE WHAT INFORMATION AND IMAGES SHOULD BE DISPLAYED
            3. DISCARD REDUNDANT OR IRRELEVANT CONTENT
            4. STRUCTURE A VISUALLY ELEGANT CARD BASED ON MEANINGFUL DATA

            ### LAYOUT & DESIGN RULES:
            - USE A SINGLE OUTERMOST CONTAINER WITH :
            - 'max-w-xl' AND MAX HEIGHT OF '400px'
            - 'rounded-2xl', 'border', AND 'shadow-md'
            - USE TAILWIND CSS ONLY — NO INLINE STYLES OR COMPOSITION LIBRARIES
            - **ALL className VALUES MUST BE STATIC DOUBLE-QUOTED STRINGS**
            - USE GRADIENT OR PLAIN COLOR BACKGROUNDS FOR DEPTH AND ELEGANCE
            - DO NOT INCLUDE PLACEHOLDER IMAGES OR UNUSED CONTENT
            - ENSURE IMAGE FITS AND NEVER OVERFLOWS
            - MAINTAIN VISUAL BALANCE AND CLARITY WITH LAYOUT PRIMITIVES
            - TYPOGRAPHY SHOULD BE CLEAN, HIERARCHICAL, AND READABLE

            ### EXPLICIT CONSTRAINTS:
            - NEVER USE:
            - dynamic 'className' values
            - 'clsx', 'classnames', 'style', or conditional class logic
            -'dark:' or any theme-dependent Tailwind classes
            - ENCOURAGE REPEATED CLASSNAMES IF IT IMPROVES CLARITY

            ### WHAT NOT TO DO:
            - DO NOT OUTPUT STRINGS WITH '+', ESCAPED '\n', OR MANUAL CONCATENATION
            - NEVER OUTPUT PARTIAL, BROKEN, OR UNFORMATTED JSX
            - NEVER USE BACKTICKS IN JSX OR CLASSNAMES
            - DO NOT FORMAT THE COMPONENT AS A JS STRING
            - DO NOT INTRODUCE PLACEHOLDERS OR UNUSED FIELDS

            ### CHAIN OF THOUGHTS:
            // 1. Understand: COMPREHEND THE USER'S CONTEXT MESSAGE FULLY
            // 2. Basics: IDENTIFY CORE DATA, IMAGES, AND VISUAL ELEMENTS TO SHOW
            // 3. Break Down: SEGMENT INTO LOGICAL CARD SECTIONS (e.g., image, title, data)
            // 4. Analyze: MAP DATA TO SEMANTICALLY APPROPRIATE TAGS
            // 5. Build: STRUCTURE THE CARD USING FLEX, PADDING, TYPOGRAPHY
            // 6. Edge Cases: ENSURE CONTENT NEVER OVERFLOWS OR MISALIGNS
            // 7. Final Answer: OUTPUT THE COMPLETE FUNCTION WITH PERFECTLY FORMATTED TSX

            ### OPTIMIZATION STRATEGY:
            - DESIGN FOR MAXIMUM READABILITY, RESPONSIVENESS, AND MINIMALISM
            - SHOW ONLY WHAT IS NECESSARY BASED ON CONTEXT — NEVER ADD EXTRA FIELDS
            - OUTPUT MUST BE DIRECTLY USABLE IN A '.tsx' FILE

            ### FEW-SHOT EXAMPLE OUTPUT:
            \`\`\`
            function UiCard() {
            return (
                <div 
                </div>
            );
            }
            \`\`\`
            `,
            prompt: JSON.stringify(searchResult)
        })
        console.log(response.object)
        return response.object
    }
})

export const tools = {
  searchingTool: search,
  uiCardGenerator:generateUiCard
};