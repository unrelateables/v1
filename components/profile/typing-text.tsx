"use client";

import { useEffect, useState } from "react";

export function TypingText({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    setShown("");
    const interval = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 90);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {shown}
      <span className="animate-pulse">|</span>
    </span>
  );
}
