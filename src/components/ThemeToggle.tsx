"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle Dark Mode"
      className="flex items-center justify-center rounded-full p-2 text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === "light" ? (
        <svg width="30" height="30">
          <path
            fill="currentColor"
            d="
      M 23, 5
      A 12 12 0 1 0 23, 25
      A 12 12 0 0 1 23, 5"
          />
        </svg>
      ) : (
        <svg width="30" height="30">
          <circle cx="15" cy="15" r="6" fill="currentColor" />

          <line
            id="ray"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            x1="15"
            y1="1"
            x2="15"
            y2="4"
          ></line>

          <use href="#ray" transform="rotate(45 15 15)" />
          <use href="#ray" transform="rotate(90 15 15)" />
          <use href="#ray" transform="rotate(135 15 15)" />
          <use href="#ray" transform="rotate(180 15 15)" />
          <use href="#ray" transform="rotate(225 15 15)" />
          <use href="#ray" transform="rotate(270 15 15)" />
          <use href="#ray" transform="rotate(315 15 15)" />
        </svg>
      )}
    </button>
  );
}
