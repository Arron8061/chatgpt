import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { ActionType } from "@/reducers/AppReducer";
import { HiPlus } from "react-icons/hi";
import { LuPanelLeft } from "react-icons/lu";

export default function Menubar() {
  const { dispach } = useAppContext();
  return (
    <div className="flex space-x-3">
      <Button
        className="flex-1"
        variant="outline"
        icon={HiPlus}
        onClick={() => {
          dispach({
            type: ActionType.UPDATE,
            field: "selectedChat",
            value: null,
          });
        }}
      >
        新建对话
      </Button>
      <Button
        variant="outline"
        icon={LuPanelLeft}
        onClick={() => {
          dispach({
            type: ActionType.UPDATE,
            field: "displayNavigation",
            value: false,
          });
        }}
      />
    </div>
  );
}
