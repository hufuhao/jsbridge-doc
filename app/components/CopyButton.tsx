"use client";

import { useState } from "react";

export function CopyButton({ text, compact = false }: { text: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <button className={compact ? "copy compact" : "copy"} onClick={copy}>{copied ? "已复制 ✓" : "复制"}</button>;
}

