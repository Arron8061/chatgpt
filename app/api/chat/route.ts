import { sleep } from "@/components/common/util";
import { MessageRequestBody } from "@/types/chat";
import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const { messages, model } = (await request.json()) as MessageRequestBody;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      //       const messageText = messages[messages.length - 1].content;
      //       for (let i = 0; i < messageText.length; i++) {
      //         await sleep(100);
      //         controller.enqueue(encoder.encode(messageText[i]));
      //       }
      //       controller.close();

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL,
      });

      const events = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello world" }, ...messages],
        stream: true,
      });

      for await (const chunk of events) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          controller.enqueue(encoder.encode(delta));
        }
      }
      controller.close();
    },
  });
  return new Response(stream);
}
