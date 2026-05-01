'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   desc: 'Age under 12', emoji: '🟢' },
  { id: 'medium', label: 'Medium', desc: 'Age 12–16',    emoji: '🟡' },
  { id: 'hard',   label: 'Hard',   desc: 'Age 16+',      emoji: '🔴' },
]

const QUESTION_COUNTS = [10, 15, 20]

function HostForm() {
  const router        = useRouter()
  const searchParams  = useSearchParams()

  const subjects = isAiTool(config) ? config.subjects : []

  const [hostName,       setHostName]       = useState('')
  const [subject,        setSubject]        = useState(searchParams.get('subject') ?? subjects[0]?.id ?? '')
  const [difficulty,     setDifficulty]     = useState('medium')
  const [questionCount,  setQuestionCount]  = useState(10)
  const [customTopic,    setCustomTopic]    = useState('')
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState('')

  // Pre-select if subject param passed from homepage
  useEffect(() => {
    const s = searchParams.get('subject')
    if (s) setSubject(s)
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hostName.trim()) { setError('Please enter your name'); return }
    if (!subject)          { setError('Please pick a subject'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/session/create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName:     hostName.trim(),
          subject,
          difficulty,
          questionCount,
          customTopic:  customTopic.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to create session')
      }

      const { sessionId } = await res.json()
      router.push(`/session/${sessionId}/host`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-16 flex items-start justify-center">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-4`}>
            🎯 Host Setup
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Configure your Quest</h1>
          <p className="text-white/50 text-lg">AI will generate the questions — just tell it what you need.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Host name */}
          <div className={`${theme.card} p-6`}>
            <label className="block text-white font-semibold mb-3">Your name (shown to players as host)</label>
            <input
              type="text"
              value={hostName}
              onChange={e => setHostName(e.target.value)}
              placeholder="e.g. Ms Johnson, Alex, Mr Smith"
              maxLength={40}
              className="input-dark"
            />
          </div>

          {/* Subject grid */}
          <div className={`${theme.card} p-6`}>
            <label className="block text-white font-semibold mb-4">Pick a subject</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {subjects.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSubject(s.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    subject === s.id
                      ? `bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10`
                      : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{s.icon}</div>
                  <div className="font-semibold text-white text-sm">{s.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className={`${theme.card} p-6`}>
            <label className="block text-white font-semibold mb-4">Difficulty</label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                    difficulty === d.id
                      ? `bg-blue-500/20 border-blue-500/50`
                      : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="text-2xl mb-1">{d.emoji}</div>
                  <div className="font-bold text-white text-sm">{d.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question count */}
          <div className={`${theme.card} p-6`}>
            <label className="block text-white font-semibold mb-4">Number of questions</label>
            <div className="flex gap-3">
              {QUESTION_COUNTS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-3 rounded-xl border font-bold text-lg transition-all duration-200 ${
                    questionCount === n
                      ? `bg-blue-500/20 border-blue-500/50 text-blue-300`
                      : 'bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Custom topic override */}
          <div className={`${theme.card} p-6`}>
            <label className="block text-white font-semibold mb-1">
              Custom topic <span className="text-white/40 font-normal">(optional)</span>
            </label>
            <p className="text-white/40 text-sm mb-3">Override the subject with a specific topic</p>
            <input
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="e.g. World War 2, Python basics, The Solar System"
              maxLength={100}
              className="input-dark"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={btn.primary + ' w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed'}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating your quiz...
              </>
            ) : (
              <>
                Generate &amp; Start Session
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {loading && (
            <p className="text-center text-white/40 text-sm animate-pulse">
              AI is writing your questions — this takes 10–20 seconds...
            </p>
          )}

        </form>
      </div>
    </div>
  )
}

export default function HostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/40">Loading...</div>}>
      <HostForm />
    </Suspense>
  )
}
