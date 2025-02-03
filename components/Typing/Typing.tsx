/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const sampleText = "The quick brown fox jumps over the lazy dog.";

export default function Typing() {
  const [input, setInput] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [started, timeLeft]);

  useEffect(() => {
    if (started) calculateWPM();
  }, [input]);

  function calculateWPM() {
    if (!startTime) return;
    const timeElapsed = (Date.now() - startTime) / 60000;
    const wordsTyped = input.trim().split(/\s+/).length;
    setWpm(Math.round(wordsTyped / timeElapsed));
    const correctChars = input
      .split("")
      .filter((char, i) => char === sampleText[i]).length;
    setAccuracy(Math.round((correctChars / sampleText.length) * 100));
  }

  function startGame() {
    setInput("");
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(30);
    setStarted(true);
    setStartTime(Date.now());
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Typing Speed Game</h1>
      <p className="text-lg mb-2">{sampleText}</p>
      <textarea
        className="w-96 h-24 p-2 bg-gray-800 text-white border rounded-lg"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={!started}
      />
      <p className="mt-2">
        WPM: {wpm} | Accuracy: {accuracy}% | Time Left: {timeLeft}s
      </p>
      <Button onClick={startGame} className="mt-4">
        Start Game
      </Button>
    </div>
  );
}
