import React, { createContext, useContext, useState, ReactNode } from "react";
import TaxChatBot from "@/components/TaxChatBot";
import TaxCalculator from "@/components/TaxCalculator";

interface ModalContextType {
  openChat: () => void;
  openCalculator: () => void;
  closeChat: () => void;
  closeCalculator: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const openCalculator = () => setIsCalculatorOpen(true);
  const closeCalculator = () => setIsCalculatorOpen(false);

  return (
    <ModalContext.Provider
      value={{ openChat, openCalculator, closeChat, closeCalculator }}
    >
      {children}
      <TaxChatBot open={isChatOpen} onClose={closeChat} />
      <TaxCalculator open={isCalculatorOpen} onClose={closeCalculator} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
