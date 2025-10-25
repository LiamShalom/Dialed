import { NextResponse } from 'next/server'

export async function GET() {
  // Simple health check used by Vercel deployment checks or uptime monitors.
  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
