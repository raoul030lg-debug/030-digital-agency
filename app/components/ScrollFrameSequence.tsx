"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const TOTAL_FRAMES = 80;
const FRAME_PATH = (idx: number) =>
  `/sequence/frame_${String(idx + 1).padStart(4, "0")}.jpg`;
const STATIC_FIRST = "/sequence/frame_0001.jpg";
const STATIC_LAST = "/sequence/frame_0080.jpg";
const OVERLAY = "rgba(250, 250, 247, 0.35)";

type Environment = "ssr" | "interactive" | "mobile" | "reduced-motion";
type Mode = "ssr" | "loading" | "interactive" | "static-first" | "static-last";

function subscribeMedia(callback: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 767px)");
  reduce.addEventListener("change", callback);
  mobile.addEventListener("change", callback);
  return () => {
    reduce.removeEventListener("change", callback);
    mobile.removeEventListener("change", callback);
  };
}

function getEnvironment(): Environment {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "reduced-motion";
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  return "interactive";
}

export default function ScrollFrameSequence({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  const env = useSyncExternalStore<Environment>(
    subscribeMedia,
    getEnvironment,
    () => "ssr",
  );
  const [framesReady, setFramesReady] = useState(false);
  const [loaded, setLoaded] = useState(0);

  const mode: Mode =
    env === "ssr"
      ? "ssr"
      : env === "reduced-motion"
        ? "static-last"
        : env === "mobile"
          ? "static-first"
          : framesReady
            ? "interactive"
            : "loading";

  useEffect(() => {
    if (env !== "interactive") return;
    if (framesReady) return;

    let cancelled = false;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let done = 0;

    const onSettle = () => {
      if (cancelled) return;
      done += 1;
      setLoaded(done);
      if (done === TOTAL_FRAMES) setFramesReady(true);
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = FRAME_PATH(i);
      img.onload = onSettle;
      img.onerror = onSettle;
      images[i] = img;
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, [env, framesReady]);

  useEffect(() => {
    if (mode !== "interactive") return;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const drawFrame = (idx: number) => {
      const img = imagesRef.current[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!cw || !ch) return;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number, dh: number, dx: number, dy: number;
      if (cr > ir) {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) / 2;
        dy = 0;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
      currentFrameRef.current = idx;
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(currentFrameRef.current);
    };

    resize();
    drawFrame(0);
    window.addEventListener("resize", resize);

    let killed = false;
    type STInstance = { kill: () => void };
    let trigger: STInstance | null = null;

    (async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(self.progress * TOTAL_FRAMES)),
          );
          if (idx !== currentFrameRef.current) drawFrame(idx);
        },
      }) as unknown as STInstance;
      ScrollTrigger.refresh();
    })();

    return () => {
      killed = true;
      window.removeEventListener("resize", resize);
      if (trigger) trigger.kill();
    };
  }, [mode]);

  if (mode === "ssr") {
    return <div className="relative">{children}</div>;
  }

  if (mode === "static-first" || mode === "static-last") {
    const url = mode === "static-last" ? STATIC_LAST : STATIC_FIRST;
    return (
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div
            className="sticky top-0 h-screen w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundColor: OVERLAY }}
            />
          </div>
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <>
      {mode === "loading" && (
        <div
          aria-hidden
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-page"
        >
          <div className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
            030 Digital
          </div>
          <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-border-subtle">
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-150 ease-out"
              style={{
                width: `${(loaded / TOTAL_FRAMES) * 100}%`,
                backgroundColor: "var(--color-accent)",
              }}
            />
          </div>
          <div className="mt-3 font-mono text-[10px] tabular-nums text-text-muted">
            {loaded.toString().padStart(2, "0")} / {TOTAL_FRAMES}
          </div>
        </div>
      )}
      <div ref={wrapperRef} className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div className="sticky top-0 h-screen w-full">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundColor: OVERLAY }}
            />
          </div>
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}
