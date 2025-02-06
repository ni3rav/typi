"use client";
import { useMetrics } from "@/context/MetricsContext";

export default function TopBar() {
  const { wpm, accuracy, correctWords, totalWords } = useMetrics();

  return (
    <div className="w-9/12 h-12 flex justify-between items-center px-4 bg-gray-800 text-white rounded-lg shadow-md">
      <div>WPM: {Math.floor(wpm)}</div>
      <div>Accuracy: {accuracy.toFixed(2)}%</div>
      <div>
        Words: {correctWords}/{totalWords}
      </div>
    </div>
  );
}
