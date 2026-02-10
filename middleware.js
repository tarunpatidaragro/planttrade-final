import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // --- Admin Protection ---
    const isPublicAdmin = path === '/admin/login';
    const isAdminPath = path.startsWith('/admin');
    const isAdmin = request.cookies.get('plant_secret_v5')?.value === 'true';

    if (isAdminPath && !isPublicAdmin && !isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
    }
    if (isPublicAdmin && isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
    }

    // --- Vendor Protection ---
    const isPublicVendor = path === '/vendor/login' || path === '/vendor/register';
    const isVendorPath = path.startsWith('/vendor');
    const isVendor = request.cookies.get('plant_vendor_v1')?.value === 'true';

    if (isVendorPath && !isPublicVendor && !isVendor) {
        return NextResponse.redirect(new URL('/vendor/login', request.nextUrl));
    }
    // Optional: Redirect to dashboard if already logged in? 
    // Usually valid, but 'register' might be accessed for new signups. 
    // Let's redirect only from Login page to avoid blocking new registrations.
    if (path === '/vendor/login' && isVendor) {
        return NextResponse.redirect(new URL('/vendor/dashboard', request.nextUrl));
    }

    return NextResponse.next();
}

// Matching Paths
export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/vendor',
        '/vendor/:path*',
    ]
};
