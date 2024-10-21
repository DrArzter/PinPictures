import React from "react";

import IconList from "./IconList";

import { FaBell } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { RiLoginBoxFill } from "react-icons/ri";
import { SlMagnifier } from "react-icons/sl";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useWindowContext } from "@/app/contexts/WindowContext";

import Authentication from "@/app/pages/Authentication/page";

interface FooterProps {
  windows: Window[];
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>;
}



export default function Footer() {

  const { windows, addWindow, openTrustedWindow } = useWindowContext();

  const iconList = [
    { name: "Bell", icon: <FaBell className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300"
      onClick={() => {handleButtonClicksex();}} /> },
    { name: "Add", icon: <CiSquarePlus className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
    { name: "Message", icon: <AiOutlineMessage className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
    { name: "Authentication", icon: <RiLoginBoxFill className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" 
    onClick={() => {openTrustedWindow("/authentication");/*handleCreateNewWindow("Authentication", "\/authentication", "Authentication", 250, 250, 545, 700, 545, 700, windows.length + 1, <Authentication />);*/}}/>},
    { name: "Search", icon: <SlMagnifier className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
  ];
  const { addNotification } = useNotificationContext();

  const handleButtonClicksex = () => {
    addNotification({
      message: `Сначала авторизуйтесь`,
      status: "info",
      time: 5000,
      clickable: true,
      link_to: "/authentication",
    });
  };


  const handleCreateNewWindow = (title: string, path: string, type: string, x: number, y: number, width: number, height: number, minWidth: number, minHeight: number, layer: number, content: JSX.Element) => {
    const newWindow: Window = {
      id: windows.length + 1,
      title: `${title} ${windows.length + 1}`,
      path: path,
      type: type,
      isOpen: true,
      fullscreen: false,
      x: x,
      y: y,
      width: width,
      height: height,
      minWidth: minWidth,
      minHeight: minHeight,
      layer: windows.length + 1,
      content: content,
    };
    setWindows([...windows, newWindow]);
  };
  const handleCreateDeveloperNewWindow = () => {
    const newWindow: Window = {
      id: windows.length + 1,
      title: `Developer ${windows.length + 1}`,
      type: "Developer",
      isOpen: true,
      fullscreen: false,
      x: 250,
      y: 250,
      width: 400,
      height: 400,
      minHeight: 200,
      minWidth: 300,
      layer: windows.length + 1,
      content: (<div className="w-full h-full"><h1>Hello World</h1></div>),
    };
    addWindow(newWindow); // Обновление состояния
  };

  return (
    <footer className="bg-white backdrop-blur-md rounded-lg bg-opacity-30 border-2 md:mb-4 md:w-1/2 mx-auto text-center py-4 fixed bottom-0 left-0 right-0 shadow-lg">
      <IconList iconList={iconList} />
      <button
        onClick={handleCreateDeveloperNewWindow}
        className="text-white text-sm font-bold hover:transform hover:scale-110 hover:cursor-pointer transition duration-300"
      >
        Create New Window (Dev)
      </button>
    </footer>
  );
}