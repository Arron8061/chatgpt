import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { HiPlus } from "react-icons/hi";
import { LuPanelLeft } from "react-icons/lu";

export default function Menubar() {
  const { setState } = useAppContext();
  return (
    <div className="flex space-x-3">
      <Button className="flex-1" variant="outline" icon={HiPlus}>
        新建对话
      </Button>
      <Button
        variant="outline"
        icon={LuPanelLeft}
        onClick={() => {
          setState((v) => {
            return { ...v, displayNavigation: false };
          });
        }}
      />
    </div>
  );
}
