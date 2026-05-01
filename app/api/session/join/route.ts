import { NextRequest, NextResponse } from 'next/server'
import { getSessionByCode, addPlayer } from '@/lib/sessions'

export async function POST(req: NextRequest) {
  try {
    const { code, playerName } = await req.json() as { code: string; playerName: string }

    if (!code || !playerName) {
      return NextResponse.json({ error: 'Missing code or playerName' }, { status: 400 })
    }

    const session = getSessionByCode(code.trim().toUpperCase())
    if (!session) {
      return NextResponse.json({ error: 'Session not found. Check your code and try again.' }, { status: 404 })
    }

    if (session.finished) {
      return NextResponse.json({ error: 'This session has already ended.' }, { status: 410 })
    }

    addPlayer(session.id, playerName.trim())

    return NextResponse.json({ sessionId: session.id, code: session.code })
  } catch (err) {
    console.error('[session/join]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
