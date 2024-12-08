"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { BsFilePost } from "react-icons/bs";
import { LiaUserSecretSolid } from "react-icons/lia";
import { LuBanana } from "react-icons/lu";
import { useEffect } from "react";
import { useUserContext } from "@/app/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const Router = useRouter();
  const { user } = useUserContext();

  useEffect(() => {
    if (!user || user?.bananaLevel === 0) {
      Router.push("/posts");
    }
  }, [user, Router]);

  const settingsOptions = [
    { name: "Summary", path: "/admin/summary", icon: <IoIosStats /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Posts", path: "/admin/posts", icon: <BsFilePost /> },
    { name: "KGB", path: "/admin/kgb", icon: <LiaUserSecretSolid /> },
  ];

  return (
    <motion.div
      className="flex flex-row justify-center items-center w-full h-[90vh] md:h-[80vh] p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Дождь из бананов */}
      <div className="banana-rain">
        {Array.from({ length: 50 }).map((_, index) => (
          <LuBanana
            key={index}
            className="banana text-yellow-400 text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Левая колонка */}
      <motion.div
        className="w-1/4 h-full p-4 border-r border-gray-700 relative z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h1
          className="text-3xl font-extrabold mb-6 border-b pb-4 flex flex-row items-center space-x-2 gap-2" 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Admin
          <motion.span
            whileHover={{ rotate: 360 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <LuBanana className="text-yellow-400" />
          </motion.span>
        </motion.h1>

        <ul className="space-y-4">
          {settingsOptions.map((option) => (
            <motion.li
              key={option.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={option.path}
                className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-200 ${
                  pathname === option.path
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "hover:bg-gray-700 hover:text-yellow-300"
                }`}
              >
                <motion.div
                  whileHover={{ rotate: 20 }}
                  transition={{ type: "spring", stiffness: 150 }}
                >
                  {option.icon}
                </motion.div>
                <span className="font-semibold">{option.name}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="flex-grow p-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
