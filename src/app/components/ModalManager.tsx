// ./src/app/components/ModalManager.tsx
"use client";

import React, { useContext } from "react";
import ModalsContext from "@/app/contexts/ModalsContext";
import CreatePostModal from "./modals/CreatePostModal";
import FullScreenImage from "./modals/FullScreenImageModal";

const ModalManager: React.FC = () => {
  const { modalType, modalProps, closeModal } = useContext(ModalsContext);

  if (!modalType) return null;

  const handleClose = () => {
    closeModal();
  };

  switch (modalType) {
    case "CREATE_POST":
      return <CreatePostModal {...modalProps} onClose={handleClose} />;
    case "FULL_SCREEN_IMAGE":
      return <FullScreenImage {...modalProps} onClose={handleClose} />;
    default:
      return null;
  }
};

export default ModalManager;
