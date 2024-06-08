import { NextResponse, NextRequest } from 'next/server';
export async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    if (pathname === '/') {
        return NextResponse.redirect(`/locations/`);
    }   
    
    return NextResponse.next();
}
