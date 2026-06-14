import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

async function proxyRequest(
  request: NextRequest,
  service: string,
  path: string[]
) {
  const targetUrl = `${BACKEND_URL}/api/${service}/${path.join('/')}`
  const headers: Record<string, string> = {
    'Content-Type': request.headers.get('content-type') || 'application/json',
    'X-Internal-Secret': process.env.INTERNAL_SECRET || 'lifeos-internal-secret-dev',
  }

  const body = request.method !== 'GET' && request.method !== 'HEAD'
    ? await request.text()
    : undefined

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    })

    // Para stream (vídeo, áudio), repassar direto a resposta do fetch sem processar como JSON
    if (path.includes('stream')) {
      return new NextResponse(response.body, {
        status: response.status,
        headers: response.headers,
      })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Erro no proxy interno' } },
      { status: 500 }
    )
  }
}

// Next.js 16: params is a Promise — must be awaited
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ service: string; path: string[] }> }
) {
  const { service, path } = await params
  return proxyRequest(req, service, path)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ service: string; path: string[] }> }
) {
  const { service, path } = await params
  return proxyRequest(req, service, path)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ service: string; path: string[] }> }
) {
  const { service, path } = await params
  return proxyRequest(req, service, path)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ service: string; path: string[] }> }
) {
  const { service, path } = await params
  return proxyRequest(req, service, path)
}
