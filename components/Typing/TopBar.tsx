"use client";
import { useMetrics } from "@/context/MetricsContext";

export default function TopBar() {
  const { wpm, accuracy, correctWords, totalWords } = useMetrics();

  return (
    <div className="w-fit h-10 flex items-center gap-6 px-6 py-2 bg-primary/20 backdrop-blur-md rounded-xl text-sm text-foreground">
      <div className="font-medium">
        WPM: <span className="font-bold">{Math.floor(wpm)}</span>
      </div>
      <div className="font-medium">
        Accuracy: <span className="font-bold">{accuracy.toFixed(2)}%</span>
      </div>
      <div className="font-medium">
        Words:{" "}
        <span className="font-bold">
          {correctWords}/{totalWords}
        </span>
      </div>
    </div>
  );
}
