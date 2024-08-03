import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const protectedRoutes = ["/create-prompt", "/profile", "/update-prompt"];

    if (protectedRoutes.includes(pathname)) {
        if (!token) {
            // Redirect to login page if not authenticated
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}