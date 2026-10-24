"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

/** The booking address as text, with a copy button (TECH-SPEC 5.9). */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  // one reset timer: a second click restarts the 2.2s instead of racing the first
  const resetRef = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(resetRef.current), []);

  const copy = async () => {
    window.clearTimeout(resetRef.current);
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      // clipboard refused: select the address so a manual copy is one keystroke
      const text = linkRef.current;
      const sel = window.getSelection();
      if (text && sel) {
        const range = document.createRange();
        range.selectNodeContents(text);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setState("failed");
    }
    resetRef.current = window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <div className="bk-email">
      <a ref={linkRef} href={`mailto:${email}`} className="bk-email-text">
        {email}
      </a>
      <button type="button" className="bk-copy" onClick={copy} aria-label={`Copy ${email}`}>
        {state === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}
        <span>{state === "copied" ? "Copied" : state === "failed" ? "Select and copy" : "Copy"}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Email address copied" : ""}
      </span>
    </div>
  );
}
