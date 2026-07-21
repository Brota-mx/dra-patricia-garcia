import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Excluye api, _next, _vercel, studio y cualquier archivo con extensión.
  matcher: "/((?!api|studio|_next|_vercel|.*\\..*).*)",
};
