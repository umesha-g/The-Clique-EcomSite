import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
    sub: string;
    role: string;
    exp: number;
}

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken');
   //const isAuthenticatedToken = request.cookies.get('isAuthenticated=')
    const path = request.nextUrl.pathname;

    //const publicPaths = ['/auth','/home','/search','/category','/product'];
    //const userPaths = ['/user'];
   // const adminPaths = ['/admin'];

    let userRole: string | null = null;
    let isTokenValid = false;

    if (authToken) {
        try {
            const decoded = jwtDecode<JWTPayload>(authToken.value);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp > currentTime) {
                userRole = decoded.role;
                isTokenValid = true;
            }
        } catch (error) {
            console.error('Token decode error:', error);
        }
    }

    if (path.startsWith('/auth') && isTokenValid) {
        if (userRole === 'ROLE_ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/home', request.url));
    }

    if (path.startsWith('/admin') && !(isTokenValid && userRole === 'ROLE_ADMIN')) {
        const redirectUrl = new URL('/home', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    if (path.startsWith('/user') && !(isTokenValid && userRole === 'ROLE_USER')) {
        const redirectUrl = new URL('/home', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}