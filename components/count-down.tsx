"use client"; // Enables client-side rendering for this component

import { useState, useRef, useEffect, ChangeEvent } from "react"; // Import React hooks and types
import { Input } from "../src/components/ui/input"; // Import custom Input component
import { Button } from "../src/components/ui/button"; // Import custom Button component

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-200 text-center">
          Countdown Timer
        </h1>
        <div className="flex items-center mb-8">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 p-3 text-lg rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button
            onClick={handleSetDuration}
            variant="outline"
            className="p-3 text-lg rounded-lg bg-blue-500 text-white dark:bg-blue-600"
          >
            Set
          </Button>
        </div>
        <div className="text-7xl font-extrabold text-gray-800 dark:text-gray-200 mb-10 text-center">
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center gap-6">
          <Button
            onClick={handleStart}
            variant="outline"
            className="p-4 text-lg font-semibold bg-green-500 text-white rounded-full dark:bg-green-600"
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            variant="outline"
            className="p-4 text-lg font-semibold bg-yellow-500 text-white rounded-full dark:bg-yellow-600"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="p-4 text-lg font-semibold bg-red-500 text-white rounded-full dark:bg-red-600"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
