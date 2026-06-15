import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_PREFIXES = [
  "authjs.",
  "__Secure-authjs.",
  "__Host-authjs.",
  "next-auth.",
  "__Secure-next-auth.",
  "__Host-next-auth.",
];

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const response = NextResponse.redirect(
    new URL("/auth/sign-in?loggedOut=1", request.url),
    303
  );

  for (const cookie of cookieStore.getAll()) {
    if (!AUTH_COOKIE_PREFIXES.some((prefix) => cookie.name.startsWith(prefix))) {
      continue;
    }

    response.cookies.set({
      name: cookie.name,
      value: "",
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure:
        request.nextUrl.protocol === "https:" ||
        cookie.name.startsWith("__Secure-") ||
        cookie.name.startsWith("__Host-"),
    });
  }

  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  // This also removes domain/path variants that cannot be targeted by name alone.
  response.headers.set("Clear-Site-Data", '"cookies"');

  return response;
}
