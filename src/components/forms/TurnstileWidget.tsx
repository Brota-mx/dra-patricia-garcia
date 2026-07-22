"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Widget de Cloudflare Turnstile.
 *
 * Se carga con el script oficial — Turnstile no requiere paquete npm — y
 * expone el token vía `onToken`. El padre decide qué mostrar si `siteKey`
 * no está configurada; este componente sólo monta el widget cuando hay
 * clave real.
 */
export function TurnstileWidget({
  siteKey,
  onToken,
  onExpire,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  onExpire: () => void;
}) {
  const containerId = `turnstile-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !window.turnstile) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: siteKey,
      callback: onToken,
      "expired-callback": onExpire,
      "error-callback": onExpire,
    });

    return () => {
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onToken/onExpire son estables por render, re-registrar el widget en cada cambio lo reiniciaría sin motivo.
  }, [scriptLoaded, containerId, siteKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div id={containerId} />
    </>
  );
}
