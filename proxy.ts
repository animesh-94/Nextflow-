import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Force Node.js runtime to fix the "unsupported modules" error
export const runtime = 'nodejs';

const isPublicRoute = createRouteMatcher([
  "/",
  "/workflow(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

// Named export 'proxy' instead of 'middleware'
export function proxy(auth: any, req: any) {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
}

// Keep your config the same
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

// Also keep the default export for compatibility with Clerk's wrapper
export default clerkMiddleware(proxy);