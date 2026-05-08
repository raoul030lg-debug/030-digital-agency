"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "030-splash-shown";

const SKYLINE_RECTS = [
  { x: 220, y: 250, w: 22, h: 40 },
  { x: 248, y: 230, w: 28, h: 60 },
  { x: 282, y: 260, w: 20, h: 30 },
  { x: 380, y: 210, w: 32, h: 80 },
  { x: 418, y: 235, w: 24, h: 55 },
  { x: 448, y: 255, w: 20, h: 35 },
  { x: 475, y: 225, w: 30, h: 65 },
  { x: 510, y: 250, w: 22, h: 40 },
  { x: 540, y: 235, w: 28, h: 55 },
  { x: 575, y: 260, w: 20, h: 30 },
  { x: 65, y: 255, w: 22, h: 35 },
  { x: 92, y: 240, w: 20, h: 50 },
];

const WINDOWS: [number, number][] = [
  [231, 262],
  [262, 242],
  [262, 255],
  [395, 225],
  [395, 240],
  [395, 255],
  [430, 250],
  [490, 240],
  [490, 255],
  [554, 250],
  [76, 265],
  [102, 255],
];

const BRANDENBURG_X = [120, 135, 150, 165, 180];

type SplashIntroProps = {
  onDone: () => void;
};

export default function SplashIntro({ onDone }: SplashIntroProps) {
  const [skylineFading, setSkylineFading] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      onDone();
      return;
    }

    const skylineTimer = setTimeout(() => setSkylineFading(true), 2300);
    const exitTimer = setTimeout(() => setExiting(true), 2800);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "true");
      onDone();
    }, 3100);

    return () => {
      clearTimeout(skylineTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  function handleSkip() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    onDone();
  }

  return (
    <div
      role="dialog"
      aria-label="030 Digital Berlin — Intro"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{
        opacity: exiting ? 0 : 1,
        transition: "opacity 300ms ease",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <span
        className="absolute left-6 top-5 font-mono"
        style={{
          color: "#888",
          fontSize: "10px",
          letterSpacing: "0.3em",
          opacity: 0,
          animation: "splash-fade-in 0.4s ease 0.2s forwards",
        }}
      >
        BERLIN · 52.520°N · 13.405°E
      </span>

      <button
        type="button"
        onClick={handleSkip}
        className="absolute right-6 top-5 cursor-pointer border-none bg-transparent font-mono transition-colors"
        style={{
          color: "#555",
          fontSize: "10px",
          letterSpacing: "0.2em",
          opacity: 0,
          animation: "splash-fade-in 0.4s ease 0.2s forwards",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#555";
        }}
      >
        SKIP →
      </button>

      <div
        className="mx-auto h-full max-h-[380px] w-full max-w-[680px]"
        style={{
          opacity: skylineFading ? 0.12 : 1,
          transform: skylineFading ? "scale(0.92)" : "scale(1)",
          transition: "opacity 600ms ease, transform 600ms ease",
        }}
      >
        <svg
          viewBox="0 0 680 380"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
        >
          <line
            x1="40"
            y1="290"
            x2="640"
            y2="290"
            stroke="var(--color-accent)"
            strokeWidth="0.5"
            opacity="0.5"
            strokeDasharray="600"
            strokeDashoffset="600"
            style={{ animation: "splash-draw-line 0.8s ease-out 0.4s forwards" }}
          />

          <g style={{ opacity: 0, animation: "splash-fade-in 0.3s ease 0.7s forwards" }}>
            <line
              x1="340"
              y1="290"
              x2="340"
              y2="120"
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{ animation: "splash-draw-line 0.8s ease-out 0.7s forwards" }}
            />
            <circle
              cx="340"
              cy="135"
              r="14"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeDasharray="90"
              strokeDashoffset="90"
              style={{ animation: "splash-draw-line 0.8s ease-out 0.9s forwards" }}
            />
            <line
              x1="340"
              y1="120"
              x2="340"
              y2="95"
              stroke="var(--color-accent)"
              strokeWidth="0.8"
              strokeDasharray="30"
              strokeDashoffset="30"
              style={{ animation: "splash-draw-line 0.6s ease-out 1.1s forwards" }}
            />
          </g>

          <g style={{ opacity: 0, animation: "splash-fade-in 0.3s ease 1.1s forwards" }}>
            {BRANDENBURG_X.map((x) => (
              <line
                key={x}
                x1={x}
                y1="290"
                x2={x}
                y2="240"
                stroke="var(--color-accent)"
                strokeWidth="1"
                strokeDasharray="50"
                strokeDashoffset="50"
                style={{ animation: "splash-draw-line 0.6s ease-out 1.1s forwards" }}
              />
            ))}
            <line
              x1="115"
              y1="240"
              x2="185"
              y2="240"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
              strokeDasharray="70"
              strokeDashoffset="70"
              style={{ animation: "splash-draw-line 0.6s ease-out 1.3s forwards" }}
            />
            <line
              x1="115"
              y1="232"
              x2="185"
              y2="232"
              stroke="var(--color-accent)"
              strokeWidth="0.5"
              opacity="0.6"
              strokeDasharray="70"
              strokeDashoffset="70"
              style={{ animation: "splash-draw-line 0.6s ease-out 1.4s forwards" }}
            />
          </g>

          <g style={{ opacity: 0, animation: "splash-fade-in 0.5s ease 1.4s forwards" }}>
            {SKYLINE_RECTS.map((r) => (
              <rect
                key={`${r.x}-${r.y}`}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.5"
              />
            ))}
          </g>

          <g style={{ opacity: 0, animation: "splash-fade-in 0.4s ease 1.8s forwards" }}>
            {WINDOWS.map(([cx, cy], i) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="0.9"
                fill="var(--color-accent)"
                className="splash-window-pulse"
                style={{ animationDelay: `${(i % 4) * 0.2}s` }}
              />
            ))}
          </g>

          <g style={{ opacity: 0, animation: "splash-fade-in 0.7s ease 2.3s forwards" }}>
            <text
              x="340"
              y="190"
              textAnchor="middle"
              fill="var(--color-accent)"
              fontFamily="var(--font-serif), serif"
              fontSize="42"
              fontWeight="500"
              letterSpacing="3"
            >
              030
            </text>
            <text
              x="340"
              y="220"
              textAnchor="middle"
              fill="#fafafa"
              fontFamily="var(--font-mono), monospace"
              fontSize="11"
              letterSpacing="6"
            >
              DIGITAL BERLIN
            </text>
            <line
              x1="290"
              y1="232"
              x2="390"
              y2="232"
              stroke="var(--color-accent)"
              strokeWidth="0.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
