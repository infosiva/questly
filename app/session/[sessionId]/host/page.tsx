'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Users, ArrowRight, Trophy, Loader2, CheckCircle } from 'lucide-react'
import { theme, btn } from '@/lib/theme'

interface Player { name: string; score: number }
interface Question {
  id: number | string
  question: string
  options: { A: string; B: string; C: string; D: string }
}
interface LastQuestion extends Question {
  answer: string
  explanation: string
}
interface SessionState {
  started: boolean
  finished: boolean
  currentQ: number
  totalQ: number
  question: Question | null
  lastQuestion: LastQuestion | null
  players: Player[]
  leaderboard: { rank: number; name: string; score: number }[] | null
}

function HostContent({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code') ?? sessionId.slice(0, 6).toUpperCase()

  const [state, setState]         = useState<SessionState | null>(null)
  const [error, setError]         = useState('')
  const [advancing, setAdvancing] = useState(false)
  const [notFound, setNotFound]   = useState(false)

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`/api/session/${sessionId}/state`)
      if (res.status === 404) { setNotFound(true); return }
      if (!res.ok) return
      const data: SessionState = await res.json()
      setState(data)
    } catch { /* network error — keep polling */ }
  }, [sessionId])

  // Poll session state every 2s
  useEffect(() => {
    fetchState()
    const iv = setInterval(fetchState, 2000)
    return () => clearInterval(iv)
  }, [fetchState])

  async function handleNext() {
    setAdvancing(true)
    setError('')
    try {
      const res = await fetch(`/api/session/${sessionId}/next`, { method: 'POST' })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Failed to advance')
      } else {
        await fetchState()
      }
    } catch {
      setError('Network error')
    } finally {
      setAdvancing(false)
    }
  }

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-4xl mb-4">😕</div>
      <h2 className="text-xl font-bold text-white mb-2">Session not found</h2>
      <p className="text-white/50 text-sm mb-6">This session may have expired. Sessions reset when the server restarts.</p>
      <button onClick={() => router.push('/host')} className={btn.primary}>
        Host a new quiz <ArrowRight size={16} />
      </button>
    </div>
  )

  if (!state) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-blue-400" />
    </div>
  )

  const { started, finished, currentQ, totalQ, question, lastQuestion, players, leaderboard } = state

  // ── Lobby (waiting for players) ─────────────────────────────
  if (!started) return (
    <div className="min-h-screen px-6 py-14 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-4`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
          </span>
          Waiting for players
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Share this code</h1>
        <p className="text-white/50 text-sm">Students go to <span className="text-blue-400 font-mono">quizbites.app/join</span></p>
      </div>

      {/* Giant code display */}
      <div className={`${theme.card} p-8 text-center mb-6`}>
        <div className="text-6xl font-black tracking-[0.3em] text-white mb-2 font-mono">
          {code || sessionId.slice(0, 6).toUpperCase()}
        </div>
        <p className="text-white/30 text-xs uppercase tracking-widest">Session code</p>
      </div>

      {/* Player list */}
      <div className={`${theme.card} p-6 mb-6`}>
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-blue-400" />
          <span className="text-white font-semibold">{players.length} player{players.length !== 1 ? 's' : ''} joined</span>
        </div>
        {players.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-4">Waiting for students to join…</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {players.map(p => (
              <span key={p.name} className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-200 text-sm font-medium">
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={advancing || players.length === 0}
        className={btn.primary + ' w-full justify-center py-4 text-base disabled:opacity-50'}
      >
        {advancing ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
        {players.length === 0 ? 'Waiting for players…' : 'Start Quiz!'}
      </button>
      {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
    </div>
  )

  // ── Finished — leaderboard ──────────────────────────────────
  if (finished && leaderboard) return (
    <div className="min-h-screen px-6 py-14 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🏆</div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Quiz complete!</h1>
        <p className="text-white/50 text-sm">{totalQ} questions · {players.length} players</p>
      </div>

      <div className={`${theme.card} p-6 mb-6`}>
        <div className="space-y-3">
          {leaderboard.map(entry => (
            <div key={entry.name} className={`flex items-center gap-4 px-4 py-3 rounded-xl ${entry.rank === 1 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-white/[0.03]'}`}>
              <span className="text-2xl font-black text-white/60 w-8 text-center">
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
              </span>
              <span className="flex-1 text-white font-semibold">{entry.name}</span>
              <span className={`font-black text-lg ${entry.rank === 1 ? 'text-yellow-400' : 'text-white/70'}`}>
                {entry.score}/{totalQ}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => router.push('/host')} className={btn.primary + ' w-full justify-center py-4 text-base'}>
        <Trophy size={18} /> Host another quiz
      </button>
    </div>
  )

  // ── Active question ─────────────────────────────────────────
  const qNum = currentQ + 1

  return (
    <div className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="h-1 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-500`}
          style={{ width: `${(qNum / totalQ) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-white/40 text-sm font-mono">Question {qNum} / {totalQ}</span>
        <div className="flex items-center gap-1.5 text-sm text-white/50">
          <Users size={14} /> {players.length} players
        </div>
      </div>

      {question ? (
        <>
          <div className={`${theme.card} p-6 mb-6`}>
            <p className="text-white text-xl font-bold leading-snug">{question.question}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {(Object.entries(question.options) as [string, string][]).map(([key, val]) => (
              <div key={key} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ background: 'rgba(37,99,235,0.3)' }}>
                  {key}
                </span>
                <span className="text-white/80 text-sm leading-snug pt-0.5">{val}</span>
              </div>
            ))}
          </div>

          {/* Last question result */}
          {lastQuestion && (
            <div className="mb-6 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-1">
                <CheckCircle size={14} /> Previous answer: {lastQuestion.answer} — {lastQuestion.options[lastQuestion.answer as keyof typeof lastQuestion.options]}
              </div>
              <p className="text-white/50 text-xs">{lastQuestion.explanation}</p>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={advancing}
            className={btn.primary + ' w-full justify-center py-4 text-base'}
          >
            {advancing ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            {currentQ + 1 >= totalQ ? 'Finish & Show Results' : 'Next Question'}
          </button>
          {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
        </>
      ) : (
        <div className="text-center py-12 text-white/40">
          <Loader2 size={28} className="animate-spin mx-auto mb-3" />
          Loading question…
        </div>
      )}
    </div>
  )
}

export default function HostPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-400" />
      </div>
    }>
      <HostContent sessionId={sessionId} />
    </Suspense>
  )
}
