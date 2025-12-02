"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// const COUNTDOWN_TIME = 300; //300; // 5 menit dalam detik
const COUNTDOWN_TIME = 3; //300; // 5 menit dalam detik

interface VisitPopupProps {
  userId: string;
  isOpen: boolean;
  onComplete: () => void;
}

export default function VisitPopup({
  userId,
  isOpen,
  onComplete,
}: VisitPopupProps) {
  const [timeLeft, setTimeLeft] = useState<number>(COUNTDOWN_TIME);
  const [visitCompleted, setVisitCompleted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (!isOpen) return;

    const todayKey = `visit_done_${new Date().toDateString()}`;

    if (localStorage.getItem(todayKey)) {
      setTimeLeft(0);
      setVisitCompleted(true);
      return;
    }

    const savedEndTime = localStorage.getItem("rakbuku_endTime");
    const now = Date.now();

    let initialEndTime: number;

    if (savedEndTime && Number(savedEndTime) > now) {
      initialEndTime = Number(savedEndTime);
      setTimeLeft(Math.floor((initialEndTime - now) / 1000));
    } else {
      initialEndTime = now + COUNTDOWN_TIME * 1000;
      localStorage.setItem("rakbuku_endTime", initialEndTime.toString());
      setTimeLeft(COUNTDOWN_TIME);
    }

    const interval = setInterval(() => {
      const endTime = Number(localStorage.getItem("rakbuku_endTime"));
      const currentTime = Date.now();
      const diff = Math.floor((endTime - currentTime) / 1000);

      if (diff > 0) {
        setTimeLeft(diff);
      } else {
        setTimeLeft(0);
        handleVisitComplete();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleVisitComplete = async () => {
    const todayKey = `visit_done_${new Date().toDateString()}`;

    if (localStorage.getItem(todayKey) || isProcessing) {
      setVisitCompleted(true);
      onComplete();
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/visit", {
        method: "POST",
        body: JSON.stringify({ userId: userIdRef.current }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        localStorage.setItem(todayKey, "true");
        setVisitCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    } catch (err) {
      console.error("Gagal menambah visit:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (COUNTDOWN_TIME - timeLeft) / COUNTDOWN_TIME;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-16 right-6 z-[9999]"
        >
          {/* Main Circular Container */}
          <div className="relative">
            {/* Circular Progress Background */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative h-20 w-20 rounded-full border-2 border-[hsl(180_20%_85%)] bg-gradient-to-br from-[hsl(35_25%_98%)] to-[hsl(180_15%_92%)] p-4 shadow-lg backdrop-blur-sm"
              style={{ boxShadow: "0 8px 32px -4px hsl(180 92% 26% / 0.1)" }}
            >
              {/* Circular Progress Bar */}
              <svg
                className="absolute inset-0 h-full w-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="hsl(180 20% 85%)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="url(#circularGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1 }}
                />
                <defs>
                  <linearGradient
                    id="circularGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="hsl(180 92% 26%)" />
                    <stop offset="100%" stopColor="hsl(180 60% 35%)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                {visitCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-xs font-medium text-[hsl(180_92%_20%)] mt-1"
                    >
                      Done
                    </motion.span>
                  </motion.div>
                ) : isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-6 w-6 rounded-full border-2 border-[hsl(180_92%_26%)] border-t-transparent"
                  />
                ) : (
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                  >
                    <span className="text-2xl font-bold text-[hsl(180_92%_20%)]">
                      {formatTime(timeLeft)}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Ping Animation */}
              {!visitCompleted && timeLeft > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-[hsl(180_92%_26%)] to-[hsl(180_60%_35%)]"
                />
              )}
            </motion.div>

            {/* Close Button (X) - Muncul hanya ketika completed */}
            {visitCompleted && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                onClick={onComplete}
                className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 shadow-lg hover:bg-red-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Status Tooltip (muncul saat hover) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-[hsl(180_92%_20%)] px-3 py-2 text-xs text-white shadow-lg"
          >
            {visitCompleted
              ? "Visit point berhasil ditambahkan! 🎉"
              : `Tetap di halaman ini selama ${Math.floor(
                  COUNTDOWN_TIME / 60
                )} menit untuk mendapatkan visit point`}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
