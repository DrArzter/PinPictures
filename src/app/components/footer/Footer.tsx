import React from "react";

import { useUserContext } from "@/app/contexts/UserContext";

export default function Footer() {

  const isMobile = false

  if (isMobile) {
    return(
      <div className="py-4">
      </div>
    )
  }

  return (
    <footer className="py-4">
    </footer>
  );
}
