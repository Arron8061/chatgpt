"use client";
import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { ActionType } from "@/reducers/AppReducer";
import { LuPanelLeft } from "react-icons/lu";

export default function Menu() {
  const {
    state: { displayNavigation },
    dispach,
  } = useAppContext();
  return (
    <Button
      variant="outline"
      className={`${displayNavigation ? "hidden" : ""} fixed left-2 top-2`}
      icon={LuPanelLeft}
      onClick={() => {
        dispach({
          type: ActionType.UPDATE,
          field: "displayNavigation",
          value: true,
        });
      }}
    />
  );
}
