import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import  { useWindowContext }  from "@/app/contexts/WindowContext";
import Window from "./Window";



export default function Windows({ mouseDown, mousePosition }) {
  const { windows, addWindow, removeWindow } = useWindowContext();

  

  return (
    <>
    {windows.map((window: Window) => (
      <Window key={window.id} window={window} mouseDown={mouseDown} mousePosition={mousePosition}  />
    ))}
    </>
  );
}
