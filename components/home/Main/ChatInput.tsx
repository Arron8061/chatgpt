import Button from "@/components/common/Button";
import { MdRefresh } from "react-icons/md";
import { PiLightningFill, PiStopBold } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";
import { Message, MessageRequestBody } from "@/types/chat";
import { useAppContext } from "@/components/AppContext";
import { ActionType } from "@/reducers/AppReducer";
import {
  useEventBusContext,
  EventListener,
} from "@/components/EventBusContext";

export default function ChatInput() {
  const [messageText, setMessageText] = useState("");
  const stopRef = useRef(false);
  const chatIdRef = useRef("");
  const {
    state: { messageList, currentModel, streamingId, selectedChat },
    dispach,
  } = useAppContext();
  const { publish, subscribe, unsubscribe } = useEventBusContext();

  useEffect(() => {
    const callback: EventListener = (data) => {
      send(data);
    };
    subscribe("createNewChat", callback);
    return () => unsubscribe("createNewChat", callback);
  }, []);

  useEffect(() => {
    if (chatIdRef.current === selectedChat?.id) {
      return;
    }
    chatIdRef.current = selectedChat?.id ?? "";
    stopRef.current = true;
  }, [selectedChat]);

  async function createOrUpdateMessage(message: Message) {
    const response = await fetch("/api/message/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(message),
    });
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { data } = await response.json();
    if (!chatIdRef.current) {
      chatIdRef.current = data.message.chatId;
      publish("fetchChatList");
      dispach({
        type: ActionType.UPDATE,
        field: "selectedChat",
        value: { id: chatIdRef.current },
      });
    }
    return data.message;
  }
  async function deleteMessage(id: string) {
    const response = await fetch(`/api/message/delete?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code } = await response.json();
    return code === 0;
  }

  async function send(content: string) {
    const message = await createOrUpdateMessage({
      id: "",
      role: "user",
      content,
      chatId: chatIdRef.current,
    });
    dispach({ type: ActionType.ADD_MESSAGE, message });
    const messages = messageList.concat([message]);
    dosend(messages);

    // if (!selectedChat?.title || selectedChat?.title === "新对话") {
    //   updateChatTitle(messages);
    // }
  }
  // async function updateChatTitle(messages: Message[]) {
  //   console.log("GPT" + messages);
  // }

  async function resend() {
    const messages = [...messageList];
    if (
      messages.length !== 0 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      const result = await deleteMessage(messages[messages.length - 1].id);

      if (!result) {
        console.log("delete error");
        return;
      }

      dispach({
        type: ActionType.REMOVE_MESSAGE,
        message: messages[messages.length - 1],
      });
      messages.splice(messages.length - 1, 1);
    }
    dosend(messages);
  }

  async function dosend(messages: Message[]) {
    try {
      stopRef.current = false;
      const body: MessageRequestBody = { messages, model: currentModel };
      const controller = new AbortController();

      console.log("发送请求:", body);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API错误:", {
          status: response.status,
          error: errorData,
        });
        throw new Error(errorData.error || "请求失败");
      }
      if (!response.body) {
        console.log("body error");
        return;
      }

      const responseMessage: Message = await createOrUpdateMessage({
        id: "",
        role: "assistant",
        content: "",
        chatId: chatIdRef.current,
      });
      dispach({ type: ActionType.ADD_MESSAGE, message: responseMessage });
      dispach({
        type: ActionType.UPDATE,
        field: "streamingId",
        value: responseMessage.id,
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let content = "";
      while (!done) {
        if (stopRef.current) {
          controller.abort();
          break;
        }
        const result = await reader.read();
        done = result.done;
        const chunk = decoder.decode(result.value);
        content += chunk;
        dispach({
          type: ActionType.UPDATE_MESSAGE,
          message: { ...responseMessage, content },
        });
      }
      createOrUpdateMessage({ ...responseMessage, content });
      dispach({
        type: ActionType.UPDATE,
        field: "streamingId",
        value: "",
      });
      setMessageText("");
    } catch (error) {
      console.error("请求错误:", error);
      // 可以在这里添加错误提示UI
      dispach({
        type: ActionType.UPDATE,
        field: "streamingId",
        value: "",
      });
    }
  }
  return (
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-8">
        {messageList.length !== 0 &&
          (streamingId !== "" ? (
            <Button
              icon={PiStopBold}
              variant="primary"
              className="font-medium "
              onClick={() => {
                stopRef.current = true;
              }}
            >
              停止生成
            </Button>
          ) : (
            <Button
              icon={MdRefresh}
              variant="primary"
              className="font-medium "
              onClick={() => {
                resend();
              }}
            >
              重新生成
            </Button>
          ))}
        <div className="flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounder-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-4">
          <div className="mx-3 mb-2.5">
            <PiLightningFill />
          </div>
          <TextareaAutosize
            className="flex-1 mb-1.5 max-h-64 outline-none bg-transparent text-black dark:text-white resize-none border-0"
            placeholder="输入一条消息..."
            rows={1}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
          />
          <Button
            className="mx-3 rounded-lg"
            icon={FiSend}
            disabled={messageText.trim() === "" || streamingId !== ""}
            variant="primary"
            onClick={() => {
              send(messageText);
            }}
          ></Button>
        </div>

        <footer className="text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-6">
          ©️{new Date().getFullYear()}&nbsp;{" "}
          <a
            className="font-medium py-[1px] border-b border-dotted border-black/60 hover:border-black/0 dark:border-gray-200 drak:hover:border-gray-200/0 "
            href="http://www.bing.com"
            target="_blank"
          >
            棠依云
          </a>
          .&nbsp;基于第三方提供接口
        </footer>
      </div>
    </div>
  );
}
