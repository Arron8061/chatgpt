export interface Chat {
  id: string;
  title: string;
  updateTime: DateTime;
}
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chatId: string;
}

export interface MessageRequestBody {
  messages: Message[];
  model: string;
}
