"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMetrics } from "@/context/MetricsContext";

interface Props {
  text?: string;
}

export const TypingText: React.FC<Props> = ({
  text = "Very down now great same where any hand mean can possible in year end much open just great a school other then at set such need because most child they without consider face might again use",
}) => {
  const { setMetrics } = useMetrics();
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

  // Split the provided text into words and characters.
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
      // When the first key is pressed, mark typing as started and set totalChars metric.
      if (!started) {
        setStarted(true);
        setMetrics((prev) => ({
          ...prev,
          totalChars: words.reduce((sum, word) => sum + word.length, 0),
        }));
      }

      // Handle Backspace: remove the last character in the current word if possible.
      if (e.key === "Backspace") {
        if (currentCharIndex > 0) {
          const newWords = [...words];
          const deletedChar = newWords[currentWordIndex][currentCharIndex - 1];

          setMetrics((prev) => ({
            ...prev,
            typedChars: Math.max(0, prev.typedChars - 1),
            correctChars:
              deletedChar.status === "correct"
                ? Math.max(0, prev.correctChars - 1)
                : prev.correctChars,
          }));

          newWords[currentWordIndex][currentCharIndex - 1].status = "waiting";
          setWords(newWords);
          setCurrentCharIndex((prev) => prev - 1);
        }
        return;
      }

      // Handle Space key: treat space as an end-of-word marker.
      if (e.key === " ") {
        const currentWord = words[currentWordIndex];

        // If the user has not finished the word, mark the remaining characters as incorrect.
        if (currentCharIndex < currentWord.length) {
          const newWords = [...words];
          // Calculate the number of characters that are being skipped.
          const skippedCount = currentWord.length - currentCharIndex;
          for (let i = currentCharIndex; i < currentWord.length; i++) {
            if (newWords[currentWordIndex][i].status === "waiting") {
              newWords[currentWordIndex][i].status = "incorrect";
            }
          }
          setWords(newWords);
          // Update the typedChars metric only once for all skipped characters.
          setMetrics((prev) => ({
            ...prev,
            typedChars: prev.typedChars + skippedCount,
          }));
        }

        // Mark the space (between words) as correct if you wish to track spaces.
        const newSpaces = [...spaces];
        if (currentWordIndex < newSpaces.length) {
          newSpaces[currentWordIndex] = "correct";
          setSpaces(newSpaces);
        }
        // Move to the next word if available.
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }
        return;
      }

      // Handle other character keys.
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        const currentWord = words[currentWordIndex];
        if (currentCharIndex < currentWord.length) {
          const newWords = [...words];
          const isCorrect = e.key === currentWord[currentCharIndex].word;
          newWords[currentWordIndex][currentCharIndex].status = isCorrect
            ? "correct"
            : "incorrect";
          setWords(newWords);
          setCurrentCharIndex((prev) => prev + 1);

          setMetrics((prev) => ({
            ...prev,
            typedChars: prev.typedChars + 1,
            correctChars: isCorrect ? prev.correctChars + 1 : prev.correctChars,
          }));
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentCharIndex, currentWordIndex, words, spaces, started, setMetrics]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-[40vh] bg-background"
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
                      ? "text-muted-foreground"
                      : char.status === "correct"
                      ? "text-primary"
                      : "text-destructive"
                  } relative`}
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  {char.word}
                  {wordIndex === currentWordIndex &&
                    charIndex === currentCharIndex && (
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="absolute left-0 bottom-0 w-0.5 h-full bg-primary/90"
                      />
                    )}
                </span>
              ))}
            </div>
            {wordIndex !== words.length - 1 && (
              <span
                className={`px-2 transition-all duration-150 ${
                  spaces[wordIndex] === "waiting"
                    ? "text-muted-foreground"
                    : spaces[wordIndex] === "correct"
                    ? "text-primary"
                    : "text-destructive"
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
            className="absolute inset-0 flex items-center justify-center bg-background bg-opacity-80"
          >
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-xl text-accent-foreground font-semibold font-mono"
            >
              Press <kbd>SHIFT</kbd> to focus
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
