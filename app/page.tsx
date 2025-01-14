"use client";
import Navigation from "@/components/home/Navigation";
import Main from "@/components/home/Main";
import { useState } from "react";
import { useAppContext } from "@/components/AppContext";

export default function Home() {
  const {
    state: { themeMode },
  } = useAppContext();
  const [counter, setCounter] = useState(0);
  const list = [
    { id: 1, value: "content1" },
    { id: 2, value: "content2" },
    { id: 3, value: "content3" },
    { id: 4, value: "content4" },
  ];

  function handleClick() {
    setCounter(counter + 1);
    // setCounter((c) => c + 1);
    // setCounter((c) => c + 1);
    // setCounter((c) => c + 1);
    // alert("click");
  }
  return (
    <div className={`${themeMode} flex h-full`}>
      <Navigation />
      <Main counter={counter} />
    </div>
  );
}
