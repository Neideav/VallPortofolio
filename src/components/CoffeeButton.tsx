"use client";

import React, { useState } from "react";
import { Coffee } from "lucide-react";

export function CoffeeButton() {
  const [count, setCount] = useState(24);
  const [popped, setPopped] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCount((prev) => prev + 1);
    setPopped(true);
    setTimeout(() => setPopped(false), 500);
  };

  return (
    <button
      onClick={handleClick}
      className="coffee-btn group"
      aria-label="Get me a coffee"
      title="Buy me a coffee"
    >
      <span className="coffee-text text-xs font-medium">Get me a coffee</span>
      <div className={`p-1 text-amber-500 transition-transform ${popped ? "scale-125" : ""}`}>
        <Coffee className="w-4 h-4 text-amber-500" />
      </div>
      <span className="font-mono text-[11px] text-muted-foreground ml-1">
        {count}
      </span>
    </button>
  );
}
