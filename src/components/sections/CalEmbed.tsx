"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Agenda embebida de Cal.com. Sólo se monta cuando `NEXT_PUBLIC_CALCOM_LINK`
 * existe — el padre decide qué mostrar en su ausencia (ver ContactPage).
 */
export function CalEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", { layout: "month_view" });
    })();
  }, []);

  return (
    <div className="h-[720px] w-full overflow-hidden rounded-card border border-line">
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
