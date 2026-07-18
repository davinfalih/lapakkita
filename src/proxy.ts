import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'lapakkita-secret')
const protectedPaths = ['/dashboard', '/api/products', '/api/orders']
const authPaths = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      await jwtVerify(token, SECRET)
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (authPaths.some(p => pathname.startsWith(p))) {
    if (token) {
      try {
        await jwtVerify(token, SECRET)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch {
        // token invalid, allow access
      }
    }
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/api/products/:path*', '/api/orders/:path*'],
}
