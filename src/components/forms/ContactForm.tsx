"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { contactSchema, contactServiceOptions } from "@/lib/contactSchema";
import type { ContactFormValues } from "@/lib/contactSchema";
import type { Locale } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";

const MESSAGE_MAX = 300;

type Status = "idle" | "submitting" | "success" | "error";
type ErrorKind = "generic" | "rate_limit" | "captcha";

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted";

/**
 * Formulario de contacto.
 *
 * Deliberadamente NO pide ningún dato de salud: el desplegable de servicio
 * ofrece opciones genéricas (no síntomas) y el mensaje libre tiene tope de
 * 300 caracteres con microcopy explícito pidiendo no incluir detalles
 * clínicos. Ver CLAUDE.md regla 4 — son datos personales sensibles bajo la
 * LFPDPPP y no queremos asumir esa responsabilidad.
 *
 * El token de Turnstile es de un solo uso: `widgetKey` fuerza un remount del
 * widget tras cada intento de envío para que el usuario resuelva un reto
 * nuevo, en vez de reintentar con un token ya consumido.
 */
export function ContactForm({
  locale,
  privacyHref,
}: {
  locale: Locale;
  privacyHref: string;
}) {
  const t = useTranslations("contactForm");
  const tPage = useTranslations("contactPage");

  const [status, setStatus] = useState<Status>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");
  const [widgetKey, setWidgetKey] = useState(0);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "general-medicine",
      message: "",
      company: "",
      turnstileToken: "",
      locale,
    },
  });

  const messageLength = watch("message")?.length ?? 0;

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setStatus("success");
        track("contact_form_submit", { service: values.service });
        reset({ ...values, name: "", email: "", phone: "", message: "", turnstileToken: "" });
        setWidgetKey((k) => k + 1);
        return;
      }

      const body: { error?: string } = await res.json().catch(() => ({}));
      if (res.status === 429) setErrorKind("rate_limit");
      else if (body.error === "captcha_failed") setErrorKind("captcha");
      else setErrorKind("generic");
      setStatus("error");
      setValue("turnstileToken", "");
      setWidgetKey((k) => k + 1);
    } catch {
      setErrorKind("generic");
      setStatus("error");
      setValue("turnstileToken", "");
      setWidgetKey((k) => k + 1);
    }
  }

  if (status === "success") {
    return (
      <Card className="text-center">
        <p className="text-title font-display font-medium text-success">
          {t("successTitle")}
        </p>
        <p className="mt-2 text-muted">{t("successBody")}</p>
      </Card>
    );
  }

  return (
    <Card as="div">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        {/* Honeypot: oculto a personas, visible para bots que auto-rellenan formularios. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Empresa</label>
          <input
            id="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("company")}
          />
        </div>

        <input type="hidden" {...register("locale")} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-ink">
              {t("nameLabel")}
            </label>
            <input
              id="name"
              type="text"
              maxLength={100}
              className={cn("mt-2", inputClass)}
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">
                {errors.name.type === "too_big"
                  ? t("validation.nameTooLong")
                  : t("validation.nameRequired")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              className={cn("mt-2", inputClass)}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {t("validation.emailInvalid")}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-ink">
              {t("phoneLabel")}
            </label>
            <input
              id="phone"
              type="tel"
              className={cn("mt-2", inputClass)}
              placeholder={t("phonePlaceholder")}
              autoComplete="tel"
              {...register("phone")}
            />
          </div>

          <div>
            <label htmlFor="service" className="text-sm font-medium text-ink">
              {t("serviceLabel")}
            </label>
            <select
              id="service"
              className={cn("mt-2", inputClass)}
              {...register("service")}
            >
              {contactServiceOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`serviceOptions.${option}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="message" className="text-sm font-medium text-ink">
              {t("messageLabel")}
            </label>
            <span className="text-sm text-muted">
              {t("messageCounter", { count: messageLength })}
            </span>
          </div>
          <textarea
            id="message"
            rows={4}
            maxLength={MESSAGE_MAX}
            className={cn("mt-2 resize-none", inputClass)}
            placeholder={t("messagePlaceholder")}
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-destructive">
              {errors.message.type === "too_small"
                ? t("validation.messageTooShort")
                : t("validation.messageTooLong")}
            </p>
          )}
          <p className="mt-2 text-sm text-muted">
            {t("privacyNote")}{" "}
            <a
              href={privacyHref}
              className="text-malva-deep underline underline-offset-4"
            >
              {t("privacyLinkLabel")}
            </a>
          </p>
        </div>

        {siteKey ? (
          <TurnstileWidget
            key={widgetKey}
            siteKey={siteKey}
            onToken={(token) => setValue("turnstileToken", token)}
            onExpire={() => setValue("turnstileToken", "")}
          />
        ) : (
          <p className="text-sm text-muted">{tPage("formUnavailable")}</p>
        )}

        {status === "error" && (
          <p className="text-sm text-destructive" role="alert">
            {errorKind === "rate_limit"
              ? t("errorRateLimit")
              : errorKind === "captcha"
                ? t("errorCaptcha")
                : t("errorGeneric")}
          </p>
        )}

        <Button
          type="submit"
          disabled={!siteKey || isSubmitting || status === "submitting"}
        >
          {status === "submitting" ? t("submitting") : t("submit")}
        </Button>
      </form>
    </Card>
  );
}
