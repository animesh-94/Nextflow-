// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// CRITICAL: Next.js 16 Proxy needs the Node.js runtime to handle Clerk's crypto
export const runtime = 'nodejs';

const isPublicRoute = createRouteMatcher([
  "/",
  "/workflow(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

// Use a named export 'proxy' or keep Clerk's default wrapper
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};