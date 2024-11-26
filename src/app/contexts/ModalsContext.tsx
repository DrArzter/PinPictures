// ./src/app/contexts/ModalsContext.tsx
"use client";
import React, { createContext, useState, ReactNode } from "react";

type ModalType = "CREATE_POST" | "FULL_SCREEN_IMAGE" | null;

interface ModalProps {
  [key: string]: any;
}

interface ModalsContextType {
  modalType: ModalType;
  modalProps: ModalProps;
  openModal: (type: ModalType, props?: ModalProps) => void;
  closeModal: () => void;
}

const ModalsContext = createContext<ModalsContextType>({
  modalType: null,
  modalProps: {},
  openModal: () => {},
  closeModal: () => {},
});

interface ModalsProviderProps {
  children: ReactNode;
}

export const ModalsProvider: React.FC<ModalsProviderProps> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<ModalProps>({});

  const openModal = (type: ModalType, props: ModalProps = {}) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps({});
  };

  return (
    <ModalsContext.Provider value={{ modalType, modalProps, openModal, closeModal }}>
      {children}
    </ModalsContext.Provider>
  );
};

export default ModalsContext;
