// ./src/app/components/modals/ModalManager.tsx
"use client";

import React, { useContext } from "react";
import ModalsContext from "@/app/contexts/ModalsContext";
import CreatePostModal from "@/app/components/modals/CreatePostModal";
import FullScreenImage from "@/app/components/modals/FullScreenImageModal";
import NewChatModal from "@/app/components/modals/NewChatModal";

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
      if (!('imageUrl' in modalProps)) return null;
      return <FullScreenImage {...modalProps} onClose={handleClose} />;
    case "CREATE_CHAT":
      return <NewChatModal {...modalProps} onClose={handleClose} />;
    default:
      return null;
  }
};

export default ModalManager;
