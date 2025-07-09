This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Journey:
- Started this project using nextjs and gemini ai with open ai compatable sdk. tried that and got some good results, but while searching for more optimal ai models and sdk i came across vercel's AI SDK.
- started reading the docs https://ai-sdk.dev/ and saw that it. The ai sdk is well documented and i found out that it is easier to use this sdk where i can switch between ai models and ai providers.
- And also the vercel ai sdk make easy access to message history. And make the server and client connection easy.
- I have levaraged the google notbookllm to ask some doubts in the docs. ( uploaded the doc website )
- intilized ai sdk with gemini 2.5 model, create a .env file with your gemnini api key.
- using tool calling method to call weather tool which internally will call weather api and get the weather details of any provided location.
- And also i have used genrateObject funtion to call LLM and refactor or formate the output from the weather api to get a precise formated object.
