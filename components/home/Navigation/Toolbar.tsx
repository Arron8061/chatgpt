import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { HiPlus } from "react-icons/hi";
import { LuPanelLeft } from "react-icons/lu";
import { MdDarkMode, MdLightMode, MdInfo } from "react-icons/md";

export default function Toolbar() {
  const {
    state: { themeMode },
    setState,
  } = useAppContext();
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 flex p-2 justify-between">
      <Button
        variant="text"
        icon={themeMode === "dark" ? MdDarkMode : MdLightMode}
        onClick={() => {
          setState((v) => {
            return {
              ...v,
              themeMode: v.themeMode === "dark" ? "light" : "dark",
            };
          });
        }}
      />

      <Button variant="text" icon={MdInfo} />
    </div>
  );
}
