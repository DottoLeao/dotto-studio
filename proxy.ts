import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Next 16.3 renomeou a convenção `middleware` para `proxy`.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
