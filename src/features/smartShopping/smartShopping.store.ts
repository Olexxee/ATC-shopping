import { create } from "zustand";

interface SmartShoppingState {
  message: string;
  setMessage: (message: string) => void;
  clear: () => void;
}

export const useSmartShoppingStore = create<SmartShoppingState>((set) => ({
  message: "",

  setMessage: (message) =>
    set({
      message,
    }),

  clear: () =>
    set({
      message: "",
    }),
}));
