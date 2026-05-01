import { NextRequest, NextResponse } from 'next/server'
import { getSession, getLeaderboard } from '@/lib/sessions'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = getSession(id)

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const q = session.currentQ >= 0 && session.currentQ < session.questions.length
    ? session.questions[session.currentQ]
    : null

  return NextResponse.json({
    started:    session.started,
    finished:   session.finished,
    currentQ:   session.currentQ,
    totalQ:     session.questions.length,
    question:   q
      ? {
          id:         q.id,
          question:   q.question,
          options:    q.options,
          // Don't reveal answer or explanation while question is active
        }
      : null,
    // Include answer + explanation only after the question has been answered (i.e., host has moved on)
    lastQuestion: session.currentQ > 0 && !session.finished
      ? (() => {
          const prev = session.questions[session.currentQ - 1]
          return prev ? { answer: prev.answer, explanation: prev.explanation, question: prev.question, options: prev.options } : null
        })()
      : session.finished && session.currentQ > 0
        ? (() => {
            const last = session.questions[session.questions.length - 1]
            return last ? { answer: last.answer, explanation: last.explanation, question: last.question, options: last.options } : null
          })()
        : null,
    players:    session.players.map(p => ({ name: p.name, score: p.score })),
    leaderboard: session.finished ? getLeaderboard(session) : null,
  })
}
