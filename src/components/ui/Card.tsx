import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Tarjeta. Bordes de 1px sobre sombras pesadas — la estética del sitio es
 * editorial y respirada, no material design.
 */
export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-line bg-surface p-6 shadow-subtle",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
