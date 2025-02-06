"use client";
import { createContext, useContext, useState } from "react";

export type Metrics = {
  typedChars: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  correctWords: number;
  totalWords: number;
  wpm: number;
  accuracy: number;
};

type MetricsContextType = Metrics & {
  setMetrics: React.Dispatch<React.SetStateAction<Metrics>>;
};

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }
  return context;
};

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<Metrics>({
    typedChars: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    correctWords: 0,
    totalWords: 0,
    wpm: 0,
    accuracy: 0,
  });

  return (
    <MetricsContext.Provider value={{ ...metrics, setMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
}
