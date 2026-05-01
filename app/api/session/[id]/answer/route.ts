import { NextRequest, NextResponse } from 'next/server'
import { recordAnswer, getSession } from '@/lib/sessions'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { playerName, questionIndex, answer } = await req.json() as {
      playerName:    string
      questionIndex: number
      answer:        string
    }

    if (!playerName || questionIndex === undefined || !answer) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const session = getSession(id)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const recorded = recordAnswer(id, playerName, questionIndex, answer)
    if (!recorded) {
      return NextResponse.json({ error: 'Player not in session' }, { status: 400 })
    }

    const question = session.questions[questionIndex]
    const correct = question?.answer === answer

    return NextResponse.json({ correct, correctAnswer: question?.answer })
  } catch (err) {
    console.error('[session/answer]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
