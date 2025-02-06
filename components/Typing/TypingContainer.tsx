"use client";
import { TypingText } from "./TypingText";
import { MetricsProvider } from "@/context/MetricsContext";
import TopBar from "./TopBar";

export function TypingContainer() {
  return (
    <MetricsProvider>
      <div className="w-full h-full flex flex-col justify-center items-center gap-8">
        <TopBar />
        <TypingText />
      </div>
    </MetricsProvider>
  );
}
