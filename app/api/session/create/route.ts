import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import { createSession, type QuizQuestion } from '@/lib/sessions'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { AI_LIMITER } from '@/lib/rateLimit'

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 14)
}

const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the capital city of France?',
    options: { A: 'London', B: 'Berlin', C: 'Paris', D: 'Madrid' },
    answer: 'C',
    explanation: 'Paris is the capital and largest city of France, located in northern France.',
  },
  {
    id: 2,
    question: 'How many sides does a hexagon have?',
    options: { A: '5', B: '6', C: '7', D: '8' },
    answer: 'B',
    explanation: 'A hexagon is a polygon with exactly 6 sides and 6 angles.',
  },
  {
    id: 3,
    question: 'What is 12 × 12?',
    options: { A: '124', B: '132', C: '144', D: '148' },
    answer: 'C',
    explanation: '12 multiplied by 12 equals 144. This is also called 12 squared.',
  },
  {
    id: 4,
    question: 'Which planet is known as the Red Planet?',
    options: { A: 'Venus', B: 'Jupiter', C: 'Saturn', D: 'Mars' },
    answer: 'D',
    explanation: 'Mars is called the Red Planet because its surface is rich in iron oxide (rust), giving it a reddish appearance.',
  },
  {
    id: 5,
    question: 'What is the chemical symbol for water?',
    options: { A: 'WO', B: 'H2O', C: 'HO2', D: 'W2O' },
    answer: 'B',
    explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, giving it the chemical formula H₂O.',
  },
]

function parseQuestions(raw: string): QuizQuestion[] {
  try {
    // Strip markdown code blocks if present
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
    const parsed = JSON.parse(cleaned)

    // Support both top-level array and { questions: [...] } shape
    const arr: unknown[] = Array.isArray(parsed) ? parsed : (parsed.questions ?? [])

    if (!Array.isArray(arr) || arr.length === 0) throw new Error('no questions array')

    return arr.map((q: unknown, i: number) => {
      const item = q as Record<string, unknown>
      // Normalise options — AI sometimes returns array or object
      let options: { A: string; B: string; C: string; D: string }

      if (Array.isArray(item.options)) {
        const [A = '', B = '', C = '', D = ''] = item.options as string[]
        options = { A, B, C, D }
      } else if (item.options && typeof item.options === 'object') {
        options = item.options as { A: string; B: string; C: string; D: string }
      } else {
        options = { A: '', B: '', C: '', D: '' }
      }

      return {
        id:          String(item.id ?? i + 1),
        question:    String(item.question ?? ''),
        options,
        answer:      String(item.answer ?? 'A').toUpperCase().charAt(0),
        explanation: String(item.explanation ?? ''),
      }
    })
  } catch {
    return FALLBACK_QUESTIONS
  }
}

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited

  try {
    const body = await req.json()
    const { hostName, subject, difficulty, questionCount, customTopic } = body as {
      hostName:      string
      subject:       string
      difficulty:    string
      questionCount: number
      customTopic?:  string
    }

    if (!hostName || !subject || !difficulty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const quizPrompt = isAiTool(config) ? (config.aiQuizPrompt ?? '') : ''
    const topic = customTopic || subject

    const prompt = `${quizPrompt}

Topic: ${topic}
Subject area: ${subject}
Difficulty: ${difficulty}
Number of questions: ${questionCount ?? 10}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation outside JSON.
Format: { "topic": "...", "difficulty": "...", "questions": [{ "id": 1, "question": "...", "options": { "A": "...", "B": "...", "C": "...", "D": "..." }, "answer": "A", "explanation": "..." }] }`

    let questions: QuizQuestion[]
    try {
      const aiResponse = await aiChat([{ role: 'user', content: prompt }], config.aiSystemPrompt, 1200, 'best')
      questions = parseQuestions(aiResponse)
    } catch {
      questions = FALLBACK_QUESTIONS
    }

    const sessionId = generateId()
    const code = generateCode()

    createSession({
      id:         sessionId,
      code,
      hostName,
      subject,
      difficulty,
      questions,
    })

    return NextResponse.json({ sessionId, code, questions })
  } catch (err) {
    console.error('[session/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
