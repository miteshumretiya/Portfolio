"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/content";

const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: site.timeZone,
  timeZoneName: "short",
});

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 15_000);
  return () => window.clearInterval(id);
}

const getTime = () => fmt.format(new Date());

// Live local time in Malta. Server render shows a neutral placeholder
// of the same width, so nothing shifts when it hydrates.
export default function MaltaClock({ className = "" }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, getTime, () => "--:-- CET");
  return (
    <time className={`tabular ${className}`} suppressHydrationWarning>
      {time}
    </time>
  );
}
