import { NextResponse, NextRequest } from 'next/server';
export async function middleware(request, event) {
    const { pathname, search } = request.nextUrl;

    if (pathname == '/install/shopify') {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shopify/load${search}`);
    }

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/inventorySchedule', request.url));
    }   
    
    return NextResponse.next();
}
