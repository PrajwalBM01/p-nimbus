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
        const response = await generateText({
            model:google("gemini-2.5-flash"),
            system : `
            You are an expert design engineer specialised in clean componenr architecture and modren design systems using React and Tawilwind CSS.
            Your task is to create a funtional react component in tsx with no external depedinces and libraries, just pure functional react component. which i will be using it with the react-live to render, so keep in mind the output it should not contain any litrals like \`.
            you will be given some context information, based on that analyise it and intelligently create the appropriate visual structure and content layout based on those context provided.
            The component should start as [ \`\`\`function UiCard()=>{} and should end\`\`\` templet litrals for muilt line]. no imports, no exports just the functional component. no string concatination.
            Your job is to:
                - parse and interpret the query result messages to understand what kind of content should be shown, you can use the images provided in the context.
                - dynamically decide what sections or card variations should exist based on that context
                - split the card into clear, well-structured layputs and keep things inline and minimal
                - design the card to be visually modern, simple, avoiding any unnecessary visual noise
  
            Component constraints:
                - the top-level card must never exceed 'max-w-xl'
                - must include 'rounded' corners, a thin border, and a subtle shadow to elevate it
                - styling must be done using Tailwind CSS utility classes only
                - you must not use any dynamic or conditional className variables — use static strings only, even if styles are repeated
                - never use 'dark:' or 'light' theming classes; avoid theme-specific design
                - avoid any form of inline styles or class composition helpers
                - if repetition in styling is necessary for layout clarity or encapsulation, it's acceptable and encouraged
                - no unused images, placeholders, or unnecessary elements should be included; only keep essential UI content
                - all class names must be passed as static strings, enclosed in double quotes — never use template literals, backticks, or variables for classNames

            Chain of reasoning:
                1. read and understand the incoming message and its content types
                2. identify what is necessary to show to the user (e.g., image, title, data values)
                3. discard anything irrelevant or redundant
                4. determine a minimal structure for the card that preserves clarity and readability
            `,
            prompt: JSON.stringify(searchResult)
        })
        console.log(response.text)
        return {componentCode:response.text}
    }
})

export const tools = {
  searchingTool: search,
  uiCardGenerator:generateUiCard
};