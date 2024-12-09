"use client";
import React, { createContext, useState, ReactNode } from "react";

type ModalType = "CREATE_POST" | "FULL_SCREEN_IMAGE" | "CREATE_CHAT" | null;

interface ModalPropsMap {
  CREATE_POST: { onClose: () => void };
  FULL_SCREEN_IMAGE: { imageUrl: string; onClose: () => void };
  CREATE_CHAT: { onClose: () => void };
}

type ModalProps<T extends ModalType> = T extends keyof ModalPropsMap
  ? ModalPropsMap[T]
  : Record<string, unknown>;

interface ModalsContextType {
  modalType: ModalType;
  modalProps: Record<string, unknown>;
  openModal: <T extends ModalType>(type: T, props?: ModalProps<T>) => void;
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
  const [modalProps, setModalProps] = useState<Record<string, unknown>>({});

  const openModal = <T extends ModalType>(type: T, props?: ModalProps<T>) => {
    setModalType(type);
    setModalProps(props ?? {});
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps({});
  };

  return (
    <ModalsContext.Provider
      value={{ modalType, modalProps, openModal, closeModal }}
    >
      {children}
    </ModalsContext.Provider>
  );
};

export default ModalsContext;
