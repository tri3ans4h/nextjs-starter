import { NextResponse } from 'next/server'
import { cookies } from "next/headers";
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import * as jose from 'jose'
export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh')?.value;
  const accessToken = request.cookies.get('access')?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload, protectedHeader } = await jose.jwtVerify(accessToken, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_ACCESS))
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/me', {
      method: 'GET',
      headers: {
        //'Cookie': cookies().toString(), //manually add cookie from server
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + accessToken,
      }
    })
    switch (response.status) {
      case 400:
        return NextResponse.redirect(new URL('/login', request.url))
      case 401:
        return NextResponse.redirect(new URL('/login', request.url))
      default:
        break;
    }

    
    const data = await response.json()

    //console.log(data)

  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  /* const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/me', {
     method: 'GET',
     credentials: "include",
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
     }
 })*/

  // console.log(refreshToken)


  /*const userToken = request.cookies.get('your-key')?.value;
  if (!userToken) {
    return NextResponse.redirect(new URL('/desired-route', request.url))
  }
  else {
    return NextResponse.redirect(new URL('/desired-route', request.url))
  }*/
}
export const config = {
  matcher: '/simplex/:path*',
}
/*
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'de'],
 
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en'
});*/