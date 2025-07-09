import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY
});


import { streamText } from 'ai';

export async function POST(req: Request) {
    const {messages} = await req.json();
    console.log(messages)
    try{
        const result = streamText({
            model: google('gemini-2.5-flash'),
            messages,
          });
        
          return result.toDataStreamResponse();
    }catch(e){
        console.log(e)
        return "somthing went wrong"
    }
}