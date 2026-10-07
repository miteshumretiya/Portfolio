"use client";

import { useState } from "react";
import { Check, Copy } from "./Icons";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      data-magnetic
      className="glass inline-flex min-h-12 items-center gap-2.5 rounded-full px-5 text-[0.95rem] font-medium text-text transition-colors duration-(--duration-2) hover:border-lime/50"
    >
      {copied ? <Check size={16} className="text-lime" /> : <Copy size={16} />}
      <span aria-live="polite">{copied ? "Copied to clipboard" : "Copy email"}</span>
    </button>
  );
}
