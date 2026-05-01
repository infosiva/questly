import { NextRequest, NextResponse } from 'next/server'
import { advanceQuestion, getLeaderboard, getSession } from '@/lib/sessions'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = advanceQuestion(id)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({
      currentQ:    session.currentQ,
      started:     session.started,
      finished:    session.finished,
      leaderboard: session.finished ? getLeaderboard(session) : null,
    })
  } catch (err) {
    console.error('[session/next]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = getSession(id)
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  return NextResponse.json({ currentQ: session.currentQ, started: session.started, finished: session.finished })
}
