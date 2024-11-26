// ./src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const res = NextResponse.next();

  // Настройка CORS заголовков
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Обработка OPTIONS запроса для CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: res.headers,
    });
  }

  if (pathname === "/") {
    const url = new URL("/posts", origin);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: "/",
};
