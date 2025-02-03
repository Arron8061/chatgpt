"use client";

import { Action, initState, reducer, State } from "@/reducers/AppReducer";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

// type State = {
//   displayNavigation: boolean;
//   themeMode: "dark" | "light";
// };

type AppContextProps = {
  state: State;
  dispach: Dispatch<Action>;
};
const AppContext = createContext<AppContextProps>(null!);

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispach] = useReducer(reducer, initState);

  // const [state, setState] = useState<State>({
  //   displayNavigation: true,
  //   themeMode: "light",
  // });
  const contextValue = useMemo(() => {
    return { state, dispach };
  }, [state, dispach]);
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
