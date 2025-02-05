"use client";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypingText } from "./TypingText";
import { MetricsProvider } from "@/context/MetricsContext";
import TopBar from "./TopBar";

export function TypingContainer() {
  return (
    <MetricsProvider>
      <div className="w-full h-[85vh] flex flex-col justify-center items-center gap-8">
        <TopBar />
        <TypingText />
        <Button
          size="lg"
          variant="ghost"
          className="hover:bg-transparent text-gray-600 hover:text-gray-300"
        >
          <RotateCcw className="scale-[2]" />
        </Button>
      </div>
    </MetricsProvider>
  );
}
