import React from "react";

interface IconItem {
  name: string;
  icon: React.ReactNode;
}

interface IconListProps {
  iconList: (IconItem | null | false)[];
}

export default function IconList({ iconList }: IconListProps) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      {iconList
        .filter((icon): icon is IconItem => icon !== null && icon !== false)
        .map((icon, index) => (
          <div key={index}>{icon.icon}</div>
        ))}
    </div>
  );
}
