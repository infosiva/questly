/**
 * lib/sessions.ts — In-memory session store for MVP
 * Module-level Map — resets on server restart (fine for MVP)
 */

export interface QuizQuestion {
  id:          number | string
  question:    string
  options:     { A: string; B: string; C: string; D: string }
  answer:      string  // "A" | "B" | "C" | "D"
  explanation: string
}

export interface PlayerState {
  name:    string
  score:   number
  answers: Record<number, string>  // questionIndex → answer given
}

export interface Session {
  id:         string
  code:       string
  hostName:   string
  subject:    string
  difficulty: string
  questions:  QuizQuestion[]
  players:    PlayerState[]
  currentQ:   number    // -1 = not started, 0..n = active question, questions.length = finished
  started:    boolean
  finished:   boolean
  createdAt:  number
}

// Module-level store — persists for the lifetime of the server process
const sessions = new Map<string, Session>()

export function createSession(data: Omit<Session, 'players' | 'currentQ' | 'started' | 'finished' | 'createdAt'>): Session {
  const session: Session = {
    ...data,
    players:   [],
    currentQ:  -1,
    started:   false,
    finished:  false,
    createdAt: Date.now(),
  }
  sessions.set(data.id, session)
  return session
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id)
}

export function getSessionByCode(code: string): Session | undefined {
  for (const s of sessions.values()) {
    if (s.code === code.toUpperCase()) return s
  }
  return undefined
}

export function updateSession(id: string, patch: Partial<Session>): Session | undefined {
  const s = sessions.get(id)
  if (!s) return undefined
  const updated = { ...s, ...patch }
  sessions.set(id, updated)
  return updated
}

export function addPlayer(sessionId: string, playerName: string): boolean {
  const s = sessions.get(sessionId)
  if (!s) return false
  if (s.players.find(p => p.name === playerName)) return true  // already joined
  s.players.push({ name: playerName, score: 0, answers: {} })
  sessions.set(sessionId, s)
  return true
}

export function recordAnswer(sessionId: string, playerName: string, questionIndex: number, answer: string): boolean {
  const s = sessions.get(sessionId)
  if (!s) return false
  const player = s.players.find(p => p.name === playerName)
  if (!player) return false
  if (player.answers[questionIndex] !== undefined) return true  // already answered

  player.answers[questionIndex] = answer
  const question = s.questions[questionIndex]
  if (question && answer === question.answer) {
    player.score += 1
  }
  sessions.set(sessionId, s)
  return true
}

export function advanceQuestion(sessionId: string): Session | undefined {
  const s = sessions.get(sessionId)
  if (!s) return undefined

  if (!s.started) {
    s.started = true
    s.currentQ = 0
  } else if (s.currentQ < s.questions.length - 1) {
    s.currentQ += 1
  } else {
    s.finished = true
    s.currentQ = s.questions.length  // signals end
  }

  sessions.set(sessionId, s)
  return s
}

export function getLeaderboard(session: Session) {
  return [...session.players]
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ rank: i + 1, name: p.name, score: p.score }))
}
