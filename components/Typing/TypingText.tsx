import React, { useState, useEffect } from "react";

interface Props {
  text?: string;
}

export const TypingText: React.FC<Props> = ({
  text = "Very down now great same where any hand mean can possible in year end much open just great a school other then at set such need because most child they without consider face might again use",
}) => {
  const [characters, setCharacters] = useState<
    Array<{ char: string; status: "waiting" | "correct" | "incorrect" }>
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const chars = text.split("").map((char) => ({
      char,
      status: "waiting",
    }));
    setCharacters(chars);
  }, [text]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!started) setStarted(true);

      if (e.key === "Backspace" && currentIndex > 0) {
        const newCharacters = [...characters];
        newCharacters[currentIndex - 1].status = "waiting";
        setCharacters(newCharacters);
        setCurrentIndex((prev) => prev - 1);
        return;
      }

      if (currentIndex < characters.length && e.key.length === 1) {
        const currentChar = characters[currentIndex];
        const newCharacters = [...characters];

        newCharacters[currentIndex].status =
          e.key === currentChar.char ? "correct" : "incorrect";

        setCharacters(newCharacters);
        setCurrentIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, characters, started]);

  return (
    <div className="w-11/12 bg-gray-800 h-96 mt-8 mb-8 p-4 overflow-y-auto font-mono">
      <div className="flex flex-wrap relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className={`text-4xl relative ${
              char.status === "waiting"
                ? "text-gray-500"
                : char.status === "correct"
                ? "text-green-500"
                : "text-red-500"
            } whitespace-pre`}
          >
            {char.char}
            {index === currentIndex && (
              <span className="absolute left-0 w-0.5 h-full bg-white animate-pulse" />
            )}
          </span>
        ))}
      </div>
      {!started && (
        <div className="text-gray-400 mt-4">Start typing to begin...</div>
      )}
    </div>
  );
};
