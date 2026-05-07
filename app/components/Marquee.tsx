"use client";

type MarqueeProps = {
  items: string[];
  /** Seconds for one full loop. Lower = faster. Default 32. */
  duration?: number;
  /** Direction: "left" | "right". Default "left". */
  direction?: "left" | "right";
  /** Pause animation on hover. Default true. */
  pauseOnHover?: boolean;
  /** Lime accent dot between items. Default true. */
  accent?: boolean;
};

export default function Marquee({
  items,
  duration = 32,
  direction = "left",
  pauseOnHover = true,
  accent = true,
}: MarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="group relative w-full overflow-hidden border-y bg-transparent py-6 md:py-7"
      style={{ borderColor: "var(--color-border-divider)" }}
    >
      <div
        className={`flex w-max ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          willChange: "transform",
        }}
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="
              flex shrink-0 items-center gap-6
              pr-6
              font-serif italic font-normal
              text-3xl leading-none tracking-tight text-text-primary
              md:gap-10 md:pr-10 md:text-5xl
              lg:text-6xl
            "
          >
            {item}
            {accent && (
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
