// NextAuth foi removido. Esta rota existe apenas para evitar 404 em links antigos.
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ error: 'Auth endpoint removido.' }, { status: 410 })
}

export function POST() {
  return NextResponse.json({ error: 'Auth endpoint removido.' }, { status: 410 })
}
