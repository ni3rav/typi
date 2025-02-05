"use client";
import { useMetrics } from "@/context/MetricsContext";

export default function TopBar() {
  const { typedChars, correctChars, totalChars } = useMetrics();

  const accuracy =
    typedChars > 0 ? ((correctChars / typedChars) * 100).toFixed(2) : "0.00";

  return (
    <div className="w-9/12 h-12 flex justify-between items-center px-4 bg-gray-800 text-white rounded-lg shadow-md">
      <div>Total Chars: {totalChars}</div>
      <div>Typed Chars: {typedChars}</div>
      <div>Correct Chars: {correctChars}</div>
      <div>Accuracy: {accuracy}%</div>
    </div>
  );
}
