// ./IconList.tsx
import React from "react";

interface IconItem {
  name: string;
  icon: React.ReactElement;
}

interface IconListProps {
  iconList: (IconItem | null | false)[];
  orientation?: "col" | "row";
  size?: number;
}

export default function IconList({
  iconList,
  orientation = "row",
  size = 36,
}: IconListProps) {
  return (
    <div className={`flex flex-${orientation} gap-4 items-center`}>
      {iconList
        .filter((icon): icon is IconItem => icon !== null && icon !== false)
        .map((icon, index) => (
          <div
            key={index}
            className="flex items-center justify-center hover:scale-110 transition-all duration-300 dark:text-white text-black cursor-pointer"
          >
            {React.cloneElement(icon.icon, {
              size: size,
              className: "transition-colors duration-300 hover:fill-yellow-500 cursor-pointer",
            })}
          </div>
        ))}
    </div>
  );
}
