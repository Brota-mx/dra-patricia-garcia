import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-surface text-ink",
  // ink sobre malva-soft: 14.99:1
  accent: "border-transparent bg-malva-soft text-ink",
};

/** Píldora para credenciales, categorías y etiquetas cortas. */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1.5 text-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
