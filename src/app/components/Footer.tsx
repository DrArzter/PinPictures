import React from "react";

import IconList from "./IconList";

import { FaBell } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { RiLoginBoxFill } from "react-icons/ri";
import { SlMagnifier } from "react-icons/sl";
import { Window } from "../types/window";

interface FooterProps {
  windows: Window[];
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>;
}



export default function Footer({ windows, setWindows }: FooterProps) {
  const iconList = [
    { name: "Bell", icon: <FaBell className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
    { name: "Add", icon: <CiSquarePlus className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
    { name: "Message", icon: <AiOutlineMessage className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
    { name: "Login", icon: <RiLoginBoxFill className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" 
    onClick={() => {
      const containerClassName = `flex flex-col items-center w-full max-w-md gap-6 p-8 sm:p-16 rounded-3xl`;

      const inputClassName = `w-full p-2 border rounded text-lightModeText`;
    
      const buttonClassName = `w-full py-2 rounded-3xl bg-red-500`;
      const content = (<div className="w-full flex flex-col items-center">
        <div className={containerClassName}>
      <div className="text-center">
        <h2 className="text-2xl">Login to PinPictures</h2>
      </div>
      <form className="flex flex-col items-center gap-4 w-full">
        <div className="w-full">
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username..."
            className={inputClassName}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password..."
            className={inputClassName}
          />
        </div>
        <button type="submit" className={buttonClassName}>
          Login
        </button>
        <button className="mt-4">
          Forgot Password?
        </button>
        <button className="mt-2">
          Don't have an account? Sign up
        </button>
      </form>
    </div>
      </div>);
      handleCreateNewWindow("Login", 250, 250, 400, 545, 400, 545, windows.length + 1, content);
    }}/> },
    { name: "Search", icon: <SlMagnifier className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
  ];

  const handleCreateNewWindow = (title: string, x: number, y: number, width: number, height: number, minWidth: number, minHeight: number, layer: number, content: JSX.Element) => {
    const newWindow: Window = {
      id: windows.length + 1, // Генерация ID, можете использовать другой способ
      title: `${title} ${windows.length + 1}`, // Название нового окна
      isOpen: true,
      fullscreen: false,
      x: x,
      y: y,
      width: width,
      height: height,
      minHeight: minHeight,
      minWidth: minWidth,
      layer: windows.length + 1,
      content: content,
    };
    setWindows([...windows, newWindow]); // Обновление состояния
  };
  const handleCreateDeveloperNewWindow = () => {
    const newWindow: Window = {
      id: windows.length + 1, // Генерация ID, можете использовать другой способ
      title: `Browser ${windows.length + 1}`, // Название нового окна
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
    setWindows([...windows, newWindow]); // Обновление состояния
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