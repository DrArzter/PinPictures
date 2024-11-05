import React from "react";

export default function NoPostsFound() {
  const className = `text-center`;

  return (
    <div className={className}>
      <p>
        No posts found. Try searching for something else or create a new post!
      </p>
    </div>
  );
}
