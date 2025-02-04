import { sleep } from "@/components/common/util";
import client from "@/lib/openai";
import { MessageRequestBody } from "@/types/chat";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messages, model } = (await request.json()) as MessageRequestBody;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const messageText = messages[messages.length - 1].content;
      for (let i = 0; i < messageText.length; i++) {
        await sleep(100);
        controller.enqueue(encoder.encode(messageText[i]));
      }
      controller.close();

      // const events = await client.streamChatCompletions(
      //   model,
      //   [{ role: "system", content: "ChatGPT" }, ...messages],
      //   {
      //     maxTokens: 1024,
      //   }
      // );
      // for await (const event of events) {
      //   for (const choice of event.choices) {
      //     const delta = choice.delta?.content;
      //     if (delta) {
      //       controller.enqueue(encoder.encode(delta));
      //     }
      //   }
      // }
      // controller.close();
    },
  });
  return new Response(stream);
}
