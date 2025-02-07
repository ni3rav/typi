"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
    Array<{ word: string; status: "waiting" | "correct" | "incorrect" }>
  >([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const restartTest = useCallback(() => {
    const wordsList = text.split(/\s+/g);
    const wordObjects = wordsList.map((word) => ({
      word,
      status: "waiting" as const,
    }));
    const totalChars = wordsList.reduce((sum, word) => sum + word.length, 0);
    const totalWords = wordsList.length;

    setWords(wordObjects);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setStarted(false);
    setStartTime(null);
    setTypedChars(Array(text.length).fill(""));
    setCompleted(false);
    setMetrics({
      totalChars,
      totalWords,
      correctChars: 0,
      incorrectChars: 0,
      typedChars: 0,
      correctWords: 0,
      wpm: 0,
      accuracy: 0,
    });
  }, [text, setMetrics]);

  useEffect(() => {
    restartTest();
  }, [restartTest]);

  useEffect(() => {
    if (currentWordIndex >= words.length && words.length > 0) {
      setCompleted(true);
    }
  }, [currentWordIndex, words.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (completed) {
        if (!e.metaKey && !e.ctrlKey) {
          restartTest();
        }
        return;
      }

      if (!started) {
        setStarted(true);
        setStartTime(Date.now());
        setMetrics((prev) => ({
          ...prev,
          totalChars: words.reduce(
            (sum, wordObj) => sum + wordObj.word.length,
            0
          ),
          totalWords: words.length,
        }));
      }

      if (e.key === " ") {
        if (currentCharIndex === words[currentWordIndex]?.word.length) {
          const newWords = [...words];
          newWords[currentWordIndex].status = "correct";
          setWords(newWords);
          setCurrentWordIndex((prev) => prev + 1);
          setCurrentCharIndex(0);

          setMetrics((prev) => ({
            ...prev,
            correctWords: prev.correctWords + 1,
          }));
        }
        return;
      }

      if (e.key === "Backspace") {
        if (currentCharIndex > 0) {
          setCurrentCharIndex((prev) => prev - 1);
          setTypedChars((prev) => {
            const newTypedChars = [...prev];
            const previousWordsLength = words
              .slice(0, currentWordIndex)
              .reduce((sum, word) => sum + word.word.length, 0);
            const globalIndex = previousWordsLength + currentCharIndex - 1;
            newTypedChars[globalIndex] = "";
            return newTypedChars;
          });
          setMetrics((prev) => ({
            ...prev,
            typedChars: Math.max(0, prev.typedChars - 1),
            correctChars: Math.max(0, prev.correctChars - 1),
            incorrectChars: Math.max(0, prev.incorrectChars - 1),
          }));
        } else if (currentWordIndex > 0) {
          const newWordIndex = currentWordIndex - 1;
          const previousWordLength = words[newWordIndex].word.length;
          setCurrentWordIndex(newWordIndex);
          setCurrentCharIndex(previousWordLength);
        }
        return;
      }

      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        if (currentWordIndex < words.length) {
          const currentWord = words[currentWordIndex].word;

          if (currentCharIndex < currentWord.length) {
            const isCorrect = e.key === currentWord[currentCharIndex];
            const previousWordsLength = words
              .slice(0, currentWordIndex)
              .reduce((sum, word) => sum + word.word.length, 0);
            const globalIndex = previousWordsLength + currentCharIndex;

            setTypedChars((prev) => {
              const newTypedChars = [...prev];
              newTypedChars[globalIndex] = e.key;
              return newTypedChars;
            });
            setCurrentCharIndex((prev) => prev + 1);

            setMetrics((prev) => {
              const newMetrics = {
                ...prev,
                typedChars: prev.typedChars + 1,
                correctChars: isCorrect
                  ? prev.correctChars + 1
                  : prev.correctChars,
                incorrectChars: isCorrect
                  ? prev.incorrectChars
                  : prev.incorrectChars + 1,
              };

              const elapsedTimeInMinutes =
                (Date.now() - (startTime || Date.now())) / 60000;
              const wpm = newMetrics.correctChars / 5 / elapsedTimeInMinutes;
              const accuracy =
                (newMetrics.correctChars / newMetrics.typedChars) * 100;

              return {
                ...newMetrics,
                wpm,
                accuracy,
              };
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentCharIndex,
    currentWordIndex,
    words,
    started,
    startTime,
    setMetrics,
    completed,
    restartTest,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-[40vh] bg-transparent"
    >
      <motion.div
        animate={{ filter: started ? "blur(0px)" : "blur(5px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-wrap justify-center text-center max-w-5xl px-4 leading-loose tracking-wider"
      >
        {words.map((word, wordIndex) => {
          const previousWordsLengthSum = words
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.word.length, 0);
          return (
            <React.Fragment key={wordIndex}>
              <div
                className={`flex py-1 ${
                  wordIndex === currentWordIndex ? "bg-primary/20" : ""
                }`}
              >
                {word.word.split("").map((char, charIndex) => {
                  const globalCharIndex = previousWordsLengthSum + charIndex;
                  const typedChar = typedChars[globalCharIndex];
                  const isTyped = typedChar !== "";
                  const isCorrect = isTyped && typedChar === char;
                  return (
                    <span
                      key={charIndex}
                      className={`text-2xl font-semibold px-0.5 transition-all duration-150 ${
                        wordIndex === currentWordIndex &&
                        charIndex === currentCharIndex
                          ? "border-b-2 border-primary"
                          : isTyped
                          ? isCorrect
                            ? "text-teal-300"
                            : "text-destructive"
                          : "text-muted-foreground"
                      } relative`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
              <span className="px-2 text-muted-foreground"> </span>
            </React.Fragment>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center backdrop-blur-lg"
          >
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-2xl text-accent-foreground font-semibold"
            >
              Start typing to begin
            </motion.p>
          </motion.div>
        )}
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center backdrop-blur-lg"
          >
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl text-accent-foreground font-semibold"
            >
              Test completed! Start typing to restart.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
