"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import * as Dialog from "@radix-ui/react-dialog";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav } from "@/content/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al navegar.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-bone/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-base font-semibold tracking-[0.08em] uppercase"
        >
          Dra. Patricia García
        </Link>

        {/* Navegación de escritorio */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label={t("menu")}
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-display text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-malva-deep"
                  : "text-ink hover:text-malva-deep",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {t(item.labelKey)}
            </Link>
          ))}
          <LocaleSwitcher />
        </nav>

        {/* Menú móvil */}
        <div className="flex items-center gap-4 md:hidden">
          <LocaleSwitcher />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="flex h-10 w-10 items-center justify-center"
              aria-label={t("openMenu")}
            >
              <span aria-hidden="true" className="flex flex-col gap-1.5">
                <span className="block h-px w-6 bg-ink" />
                <span className="block h-px w-6 bg-ink" />
              </span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/20" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-line bg-bone p-6">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="eyebrow text-muted">
                    {t("menu")}
                  </Dialog.Title>
                  <Dialog.Close
                    className="flex h-10 w-10 items-center justify-center text-2xl"
                    aria-label={t("closeMenu")}
                  >
                    <span aria-hidden="true">&times;</span>
                  </Dialog.Close>
                </div>
                <nav className="mt-10 flex flex-col gap-6">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="font-display text-subheading font-medium"
                    >
                      {t(item.labelKey)}
                    </Link>
                  ))}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
