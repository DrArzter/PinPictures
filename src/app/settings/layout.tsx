// ./src/app/settings/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaBell, FaPalette } from "react-icons/fa";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const settingsOptions = [
    { name: "Account Settings", path: "/settings/account", icon: <FaUser /> },
    { name: "Privacy Settings", path: "/settings/privacy", icon: <FaLock /> },
    { name: "Notifications", path: "/settings/notifications", icon: <FaBell /> },
    { name: "Appearance", path: "/settings/appearance", icon: <FaPalette /> },
  ];

  return (
    <motion.div
      className="flex flex-row justify-center items-center w-full h-[90vh] md:h-[80vh] p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Левая колонка */}
      <motion.div
        className="w-1/4 h-full p-4 border-r"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h1
          className="text-2xl font-bold mb-6 border-b pb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Settings
        </motion.h1>
        <ul className="space-y-2">
          {settingsOptions.map((option) => (
            <motion.li
              key={option.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={option.path}
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                  pathname === option.path
                    ? "bg-yellow-500 text-white"
                    : ""
                }`}
              >
                {option.icon}
                <span>{option.name}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="flex-grow p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
