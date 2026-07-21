"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { useTranslations } from "next-intl";
import { answeredFaq } from "@/content/faq";
import type { Locale } from "@/i18n/routing";

/**
 * Preguntas frecuentes en acordeón accesible.
 *
 * Cada pregunta tiene su propio ancla (`#faq-N`) para poder mandar el enlace de
 * una respuesta concreta por WhatsApp. Cada respuesta se vuelve así una
 * herramienta reutilizable, no sólo contenido de página.
 *
 * ⚠️ Si no hay ninguna pregunta contestada, la sección NO se renderiza. Todas
 * las respuestas dependen de la doctora (15 de 22 requieren su criterio, 6 son
 * puramente médicas); publicar "Próximamente" bajo una pregunta de seguridad
 * sería peor que no tener la sección.
 */
export function FAQ({ locale }: { locale: Locale }) {
  const t = useTranslations("sections");
  const items = answeredFaq(locale);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20">
      <h2 className="text-heading">{t("faqTitle")}</h2>
      <p className="mt-3 max-w-[58ch] text-muted">{t("faqLead")}</p>

      <Accordion.Root type="single" collapsible className="mt-10 max-w-[68ch]">
        {items.map((item, i) => (
          <Accordion.Item
            key={i}
            value={`faq-${i}`}
            id={`faq-${i}`}
            className="border-b border-line"
          >
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between gap-6 py-5 text-left font-display font-medium transition-colors hover:text-malva-deep [&[data-state=open]>span]:rotate-45">
                {item.question[locale]}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl text-malva-deep transition-transform duration-200"
                >
                  +
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pb-5 text-muted">
              {item.answer?.[locale]}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
