export { auth as middleware } from '@/app/api/auth/[...nextauth]/route'

export const config = {
  matcher: [
    '/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
