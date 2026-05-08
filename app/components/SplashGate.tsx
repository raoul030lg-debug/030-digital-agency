"use client";

import { useEffect, useState } from "react";
import SplashIntro from "./SplashIntro";

const STORAGE_KEY = "030-splash-shown";

export default function SplashGate() {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const shown = sessionStorage.getItem(STORAGE_KEY);
      setShouldShow(!shown);
    } catch {
      setShouldShow(false);
    }
  }, []);

  if (shouldShow !== true) return null;

  return <SplashIntro onDone={() => setShouldShow(false)} />;
}
