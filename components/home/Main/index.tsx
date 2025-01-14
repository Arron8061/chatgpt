import Menu from "./Menu";

type Props = {
  counter: number;
};
export default function Main(props: Props) {
  return (
    <main className="relative flex-1 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 p-2">
      主体内容:{props.counter}
      <Menu />
    </main>
  );
}
