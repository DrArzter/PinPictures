import React from "react";

export default function Comment({ comment }) {
  return (
    <div className="flex flex-row gap-4 items-start mt-4 p-3 border rounded-lg shadow-sm ">
      <img
        src={comment.User.avatar}
        alt="Comment Author Avatar"
        className="w-12 h-12 rounded-full"
      />
      <div className="flex flex-col">
        <p className="font-bold">{comment.User.name}</p>
        <p className="">{comment.comment}</p>
        <p className="text-sm text-gray-500">{comment.createdAt}</p>
      </div>
    </div>
  );
}
