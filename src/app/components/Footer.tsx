import React, { useEffect, use } from "react";

import IconList from "./IconList";

import { FaBell } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { RiLoginBoxFill } from "react-icons/ri";
import { SlMagnifier } from "react-icons/sl";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";

import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { useWindowContext } from "@/app/contexts/WindowContext";
import { useUserContext } from "@/app/contexts/userContext";


interface FooterProps {
  windows: Window[];
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>;
}



export default function Footer() {
  const { user, userLoading } = useUserContext();

  const { openWindowByPath } = useWindowContext();

  const iconList = [
    { name: "Post", icon: <BsFillFileEarmarkPostFill className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" onClick={() => {openWindowByPath("/posts");}} />  },
    { name: "Bell", icon: <FaBell className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300"
      onClick={() => {handleButtonClicksex();}} /> },
    { name: "Add",
      icon: (
        <CiSquarePlus 
        className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" 
        onClick={() => openWindowByPath("/post/create")}/> 
      )
    },
    { name: "Message", icon: <AiOutlineMessage className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
    {
      name: "Authentication",
      icon: (
        <RiLoginBoxFill
          className="w-8 h-8 text-white hover:scale-110 hover:cursor-pointer transition duration-300"
          onClick={() => openWindowByPath("/authentication")}
        />
      ),
    },
    { name: "Search", icon: <SlMagnifier className="w-8 h-8 text-white hover:transform hover:scale-110 hover:cursor-pointer transition duration-300" /> },
  ];

  const { addNotification } = useNotificationContext();


  useEffect(() => {
    console.log(`rgba(${user?.settings.bgColor})`);
  }, [user]);


  const handleButtonClicksex = () => {
    addNotification({
      message: `Сначала авторизуйтесь`,
      status: "info",
      time: 5000,
      clickable: true,
      link_to: "/authentication",
    });
  };

  return (
    (userLoading) ? <div></div> :
    <footer 
    style={{ 
      backgroundColor: `rgba(${user?.settings.bgColor})`
     }}
    className={`backdrop-blur-md rounded-lg
    bg-opacity-30 border-2 md:mb-4 md:w-1/2 mx-auto text-center py-4 fixed bottom-0 left-0 right-0 shadow-lg`}>
      <IconList iconList={iconList} />
    </footer>
  );
}