import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/types";
import { getConfiguredAllowedEmails } from "@/lib/config";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const response = NextResponse.next({ request });

  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const supabaseAnonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  if (!supabaseUrl || !supabaseAnonKey) return response;

  const supabase = createServerClient<Database, "public", any>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: unknown }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as never);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isPublicRoute =
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/api/health") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.startsWith("/robots.txt") ||
    url.pathname.startsWith("/sitemap.xml");

  if (!user && !isPublicRoute) {
    url.pathname = "/auth";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && url.pathname.startsWith("/auth")) {
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user) {
    const allowedEmails = getConfiguredAllowedEmails();
    if (allowedEmails.length > 0) {
      const email = user.email?.toLowerCase() ?? "";
      if (!allowedEmails.includes(email)) {
        await supabase.auth.signOut();
        url.pathname = "/auth/blocked";
        url.search = "";
        const redirectResponse = NextResponse.redirect(url);
        response.cookies.getAll().forEach((c) => {
          redirectResponse.cookies.set(c.name, c.value, c);
        });
        return redirectResponse;
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all routes except Next.js internals and static files.
     */
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
  ]
};
