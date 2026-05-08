"use client";

import { useState } from "react";

interface AirlineLogoProps {
  code: string;
  name: string;
  size?: "sm" | "md";
}

const SOURCES = [
  (code: string) => `https://images.kiwi.com/airlines/64/${code}.png`,
  (code: string) => `https://content.airhex.com/airline-logos/${code}_square.png`,
  (code: string) => `https://www.gstatic.com/flights/airline_logos/70px/${code}.png`,
];

const imgSizes = { sm: "w-5 h-5", md: "h-9 w-9" };
const fallbackSizes = { sm: "w-5 h-5", md: "w-9 h-9" };
const textSizes = { sm: "text-[8px]", md: "text-xs" };

export function AirlineLogo({ code, name, size = "md" }: AirlineLogoProps) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`${fallbackSizes[size]} rounded-lg bg-blue-100 flex items-center justify-center`}>
        <span className={`${textSizes[size]} font-bold text-blue-600`}>{code}</span>
      </div>
    );
  }

  return (
    <img
      src={SOURCES[srcIndex](code)}
      alt={name}
      className={`${imgSizes[size]} object-contain p-0.5`}
      onError={() => {
        if (srcIndex < SOURCES.length - 1) {
          setSrcIndex(srcIndex + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
