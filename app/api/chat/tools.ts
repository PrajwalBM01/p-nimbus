import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { tavily } from '@tavily/core';
import { tool as createTool, generateObject, generateText } from 'ai';
import { z } from 'zod';


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
              includeAnswer:true,
              includeImages: true,
              includeImageDescriptions: true,
              includeFavicon: true
          })
          console.log(response)
          return response
          
      }catch(e){
          console.log("Something went wrong while searching")
          return {"error":"sonthing got error"}
      }
  }
})

// export const genrateUI = createTool({
//   description:'Genrate creative card designs for weather,stock price,product price.',
//   parameters: 
// })


export const tools = {
  searchingTool: search,
};