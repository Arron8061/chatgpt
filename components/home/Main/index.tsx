import ChatInput from "./ChatInput";
import Menu from "./Menu";
import MessageList from "./MessageList";
import Welcome from "./Welcome";

type Props = {
  counter: number;
};
export default function Main(props: Props) {
  return (
    <div className="flex-1 relative">
      <main className="overflow-y-auto w-full h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 p-2">
        <Menu />
        {/* <Welcome /> */}
        <MessageList />
        <ChatInput />
      </main>
    </div>
  );
}
