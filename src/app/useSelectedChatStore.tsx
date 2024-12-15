"use client";

import { create } from 'zustand';

type State = {
  selectedChatId: string | undefined;
  setSelectedChatId: (id: string | undefined) => void;
};

export const useSelectedChatStore = create<State>((set) => ({
  selectedChatId: undefined,
  setSelectedChatId: (id) => set({ selectedChatId: id }),
}));
