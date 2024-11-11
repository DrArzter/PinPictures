import React from "react";

export default function IconList({ iconList } : any) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      {iconList.map((icon: any, index: number) => (
        <div key={index}>{icon.icon}</div>
      ))}
    </div>
  );
}
