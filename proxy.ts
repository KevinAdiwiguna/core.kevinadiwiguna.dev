import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const session = request.cookies.get("session_token")?.value;

    const isLoginPage = pathname === "/login";

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    if (session && (pathname === "/" || isLoginPage)) {
        return NextResponse.redirect(new URL("/kevinadiwiguna", request.url));
    }

    if (!session && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
