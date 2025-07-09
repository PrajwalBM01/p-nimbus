import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { tools } from './tools';

const google = createGoogleGenerativeAI({
  apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY
});



export async function POST(req: Request) {
    const {messages} = await req.json();
    console.log(messages)
    try{
        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: 'You are a helpful and conversational AI assistant. Use the provided tools only when it is essential to answer the user\'s question or fulfill their request and do not tell them tahat you can only do what the tools are capable of. Otherwise, provide a clear, concise, and direct natural language response.', 
            messages,
            tools,
            maxSteps:5,
            onStepFinish: async(result)=>{
                console.log(result.toolCalls)
                console.log(result.toolResults)
                console.log(result.toolResults.map(call=>call.result))
            }
          });
        
          return result.toDataStreamResponse();
    }catch(e){
        console.log(e)
        return "somthing went wrong"
    }
}