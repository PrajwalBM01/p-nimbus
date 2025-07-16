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
            model: google('gemini-2.5-pro'),
            system:`You are a helpful and conversational AI assistant. You have access to web search capabilities through the searchingTool. 
                Use web search when:
                - Asked about current events, news, or real-time information
                - Asked about recent developments or updates
                - When you need to verify or get the latest information on a topic
                - For specific factual queries that might have changed recently
                And once you got the results Use uiCardGenerator to visalise the results of the search tool, no need to mention the user that you have create a visual represneation.
                Provide natural, conversational responses and don't mention the technical details of your tools unless specifically asked.`,
            messages,
            tools,
            maxSteps:3,
            onStepFinish:async(stepresult)=>{
                console.log(stepresult.finishReason)
                console.log(stepresult.toolCalls)
                console.log(stepresult.toolResults)
            }
        })
        return result.toDataStreamResponse()
    }catch(e){
        console.log(e)
        return new Response('Something went wrong', {
            status: 500,
        });
    }
}
