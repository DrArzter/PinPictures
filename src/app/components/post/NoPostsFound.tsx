import React from "react";

export default function NoPostsFound() {
  const className = `flex flex-col items-center justify-center h-[85vh] md:h-[90vh] text-yellow-500`;

  return (
    <div className={className}>
      <p>
        No posts found. Try searching for something else or create a new post!
      </p>
    </div>
  );
}
