"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  text?: string;
}

export const TypingText: React.FC<Props> = ({
  text = "Very down now great same where any hand mean can possible in year end much open just great a school other then at set such need because most child they without consider face might again use",
}) => {
  const [words, setWords] = useState<
    Array<Array<{ word: string; status: "waiting" | "correct" | "incorrect" }>>
  >([]);
  const [spaces, setSpaces] = useState<
    Array<"waiting" | "correct" | "incorrect">
  >([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wordsList = text.split(/\s+/g);
    const wordObjects = wordsList.map((word) =>
      word.split("").map((char) => ({
        word: char,
        status: "waiting" as const,
      }))
    );
    const spacesList =
      wordsList.length > 1 ? Array(wordsList.length - 1).fill("waiting") : [];
    setWords(wordObjects);
    setSpaces(spacesList);
  }, [text]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!started) setStarted(true);

      if (e.key === "Backspace") {
        if (currentCharIndex > 0) {
          const newWords = [...words];
          newWords[currentWordIndex][currentCharIndex - 1].status = "waiting";
          setWords(newWords);
          setCurrentCharIndex((prev) => prev - 1);
        } else if (currentWordIndex > 0) {
          const newWordIndex = currentWordIndex - 1;
          const newCharIndex = words[newWordIndex].length;
          if (newWordIndex < spaces.length) {
            const newSpaces = [...spaces];
            newSpaces[newWordIndex] = "waiting";
            setSpaces(newSpaces);
          }
          setCurrentWordIndex(newWordIndex);
          setCurrentCharIndex(newCharIndex);
        }
        return;
      }

      if (currentWordIndex < words.length) {
        const currentWord = words[currentWordIndex];

        if (e.key === " ") {
          if (currentCharIndex === currentWord.length) {
            if (currentWordIndex < spaces.length) {
              const newSpaces = [...spaces];
              newSpaces[currentWordIndex] = "correct";
              setSpaces(newSpaces);
            }
            setCurrentWordIndex((prev) => prev + 1);
            setCurrentCharIndex(0);
          } else {
            const newWords = [...words];
            for (let i = currentCharIndex; i < currentWord.length; i++) {
              newWords[currentWordIndex][i].status = "incorrect";
            }
            setWords(newWords);
            if (currentWordIndex < spaces.length) {
              const newSpaces = [...spaces];
              newSpaces[currentWordIndex] = "incorrect";
              setSpaces(newSpaces);
            }
            setCurrentCharIndex(currentWord.length);
          }
        } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
          if (currentCharIndex < currentWord.length) {
            const newWords = [...words];
            newWords[currentWordIndex][currentCharIndex].status =
              e.key === currentWord[currentCharIndex].word
                ? "correct"
                : "incorrect";
            setWords(newWords);
            setCurrentCharIndex((prev) => prev + 1);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentCharIndex, currentWordIndex, words, spaces, started]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-[80vh] bg-gray-900"
    >
      <motion.div
        animate={{ filter: started ? "blur(0px)" : "blur(5px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-wrap justify-center text-center max-w-5xl px-4 leading-relaxed tracking-wide"
      >
        {words.map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            <div className="flex">
              {word.map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`text-2xl font-mono px-0.5 transition-all duration-150 ${
                    char.status === "waiting"
                      ? "text-gray-500"
                      : char.status === "correct"
                      ? "text-green-400"
                      : "text-red-400"
                  } relative`}
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  {char.word}
                  {wordIndex === currentWordIndex &&
                    charIndex === currentCharIndex && (
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{
                          opacity: [0.2, 1, 0.2],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute left-0 w-0.5 h-full bg-blue-400"
                      />
                    )}
                </span>
              ))}
            </div>
            {wordIndex !== words.length - 1 && (
              <span
                className={`px-2 transition-all duration-150 ${
                  spaces[wordIndex] === "waiting"
                    ? "text-gray-500"
                    : spaces[wordIndex] === "correct"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {" "}
              </span>
            )}
          </React.Fragment>
        ))}
      </motion.div>

      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80"
          >
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-xl text-blue-400 font-semibold font-mono"
            >
              Press any key to focus
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
