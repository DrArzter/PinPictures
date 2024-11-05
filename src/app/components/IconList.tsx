import React from "react";

export default function IconList({ iconList }) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      {iconList.map((icon, index) => (
        <div key={index}>{icon.icon}</div>
      ))}
    </div>
  );
}
