'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { ArrowRight, Zap, Users, CheckCircle, Monitor, Star, BarChart2, Download, Infinity, Sparkles } from 'lucide-react'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { Spotlight } from '@/components/aceternity/spotlight'
import { CardContainer, CardBody, CardItem } from '@/components/aceternity/card-3d'
import GuidedTour, { type TourStep } from '@/components/GuidedTour'

const QUESTLY_TOUR: TourStep[] = [
  { target: '#hero-host-btn', title: 'Host a quiz free', icon: '🎯', body: 'Pick any topic — AI writes all questions with explanations instantly. No prep needed.', placement: 'bottom' },
  { target: '#how-it-works', title: 'How it works', icon: '📡', body: 'Students join on any device with a code — no account, no app download.', placement: 'top' },
  { target: '#subjects', title: 'Any subject', icon: '📚', body: 'Science, history, maths — or type your own custom topic. AI handles the rest.', placement: 'top' },
]

// ── Static data ───────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: '🎯',
    step: '01',
    title: 'Pick topic & difficulty',
    desc: 'Choose any subject, set difficulty and number of questions. Custom topics fully supported.',
  },
  {
    icon: '✨',
    step: '02',
    title: 'AI generates quiz instantly',
    desc: 'Full quiz with questions, options, and AI-written explanations — ready in seconds.',
  },
  {
    icon: '🏆',
    step: '03',
    title: 'Class joins & plays live',
    desc: 'Share the 6-character code. Students join on any device. Scores update in real time.',
  },
]

const PRO_FEATURES = [
  { icon: <Infinity size={20} />, title: 'Unlimited Students', desc: 'No cap on class size — host 200+ students in one session' },
  { icon: <Sparkles size={20} />, title: 'Custom AI Quiz Gen', desc: 'Generate quizzes from your own lesson notes or curriculum' },
  { icon: <BarChart2 size={20} />, title: 'Analytics Dashboard', desc: 'Track student performance, identify gaps, monitor progress' },
  { icon: <Download size={20} />, title: 'Export Results', desc: 'Download scores as CSV or PDF for your records' },
]

const TESTIMONIALS = [
  {
    name: 'Ms. Rachel Torres',
    role: 'Year 9 Science Teacher, London',
    quote: 'My students actually beg to do revision now. QuizBites has transformed how I do formative assessment.',
    stars: 5,
  },
  {
    name: 'Mr. David Kim',
    role: 'Maths Department Head, Manchester',
    quote: "Took me 30 seconds to set up my first quiz. The AI explanations after each question are genuinely brilliant.",
    stars: 5,
  },
  {
    name: 'Mrs. Priya Nair',
    role: 'Primary School Teacher, Birmingham',
    quote: 'Students on phones for LEARNING instead of distracting — my head teacher was amazed. Love the live leaderboard.',
    stars: 5,
  },
]

// ── Animated countdown timer ──────────────────────────────────

function CountdownTimer() {
  const [count, setCount] = useState(10)
  useEffect(() => {
    const iv = setInterval(() => setCount(c => (c <= 1 ? 10 : c - 1)), 1000)
    return () => clearInterval(iv)
  }, [])
  const pct = ((10 - count) / 10) * 100
  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r="34" fill="none"
          stroke="#2563eb" strokeWidth="6"
          strokeDasharray={`${2 * Math.PI * 34}`}
          strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white">{count}</span>
        <span className="text-[9px] text-blue-300 uppercase tracking-widest">secs</span>
      </div>
    </div>
  )
}

// ── Network dots background (blue electric) ───────────────────

function NetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const NODES = 48
    type Node = { x: number; y: number; vx: number; vy: number }
    const nodes: Node[] = Array.from({ length: NODES }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(37,99,235,${0.18 * (1 - dist / 130)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(96,165,250,0.7)'
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  )
}

// ── Classroom mockup ──────────────────────────────────────────

function ClassroomMockup() {
  const [joinCount, setJoinCount] = useState(14)
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.6) setJoinCount(c => Math.min(c + 1, 32))
    }, 2400)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="relative w-full max-w-lg mx-auto mt-10">
      {/* Teacher dashboard card */}
      <div className="rounded-2xl border border-blue-500/30 p-4 mb-3"
        style={{ background: 'rgba(7,13,26,0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-white/50 font-mono uppercase tracking-widest">Teacher Dashboard</span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-3xl font-black text-white font-mono tracking-tight">A7F2K9</div>
            <div className="text-[11px] text-blue-300 mt-0.5">Session code — share with class</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-black text-white">{joinCount}</div>
            <div className="text-[11px] text-white/40">students joined</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${(joinCount / 32) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-1">
          <span>0</span><span>{joinCount} / 32 students</span>
        </div>
      </div>

      {/* Student device row */}
      <div className="flex gap-2 overflow-hidden">
        {['Sarah M.', 'James T.', 'Priya K.', 'Leo R.'].map((name, i) => (
          <div key={name}
            className="flex-1 rounded-xl border border-white/10 p-2.5 text-center"
            style={{ background: 'rgba(7,13,26,0.70)', backdropFilter: 'blur(12px)', animationDelay: `${i * 0.15}s` }}>
            <div className="text-lg mb-1">{['📱', '💻', '📱', '🖥️'][i]}</div>
            <div className="text-[10px] text-white/60 font-medium truncate">{name}</div>
            <div className="mt-1 text-[9px] text-blue-300 font-mono">
              {['1st', '2nd', '3rd', '4th'][i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function HomePage() {
  const subjects = isAiTool(config) ? config.subjects : []
  const [isPro, setIsPro] = useState(false)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    // Check localStorage for pro status
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('quizbites-pro') === '1') setIsPro(true)
    }
    // Check ?upgraded=1 param
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === '1') {
      setIsPro(true)
      if (typeof window !== 'undefined') localStorage.setItem('quizbites-pro', '1')
      // Clean up URL
      window.history.replaceState({}, '', '/')
    }
  }, [])

  async function handleUpgrade() {
    setUpgrading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setUpgrading(false)
    }
  }

  return (
    <div className="overflow-hidden">

      {/* ── HERO — Live Classroom Energy ─────────────────────── */}
      <section className="relative px-6 pt-14 pb-20 text-center overflow-hidden min-h-[88vh] flex flex-col justify-center">
        {/* Aceternity Spotlight */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 pointer-events-none" fill="#2563eb" />

        {/* Animated network dots background */}
        <NetworkBg />

        {/* Electric blue radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.18] blur-3xl -z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, #1d4ed8 0%, #0ea5e9 40%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto relative">

          {/* Social proof badge */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              LIVE
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Zap size={10} /> Used in 500+ classrooms
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
              <Star size={10} fill="currentColor" /> Better than Kahoot
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-black leading-[0.90] tracking-tight mb-6">
            <span className="block text-white text-4xl sm:text-5xl md:text-7xl mb-2">Run live quizzes your</span>
            <span className="block text-4xl sm:text-5xl md:text-7xl"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 50%, #67e8f9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              students actually enjoy
            </span>
            <span className="block text-white/60 text-xl sm:text-2xl md:text-3xl font-bold mt-3">powered by AI</span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-8">
            Pick a topic, AI writes all the questions with explanations — your class plays live on any device, from any browser.
          </p>

          {/* Countdown + Join box row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            {/* Countdown */}
            <div className="flex flex-col items-center gap-1">
              <CountdownTimer />
              <span className="text-[11px] text-white/35 mt-1">avg quiz creation</span>
            </div>

            {/* Session join box */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <div className="flex items-center rounded-xl overflow-hidden border border-blue-500/30"
                style={{ background: 'rgba(7,13,26,0.80)', backdropFilter: 'blur(12px)' }}>
                <input
                  type="text"
                  readOnly
                  placeholder="Enter session code"
                  className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none font-mono tracking-widest"
                />
                <Link href="/join"
                  className="px-5 py-3.5 text-sm font-black text-white transition-all hover:brightness-110 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)' }}>
                  Join →
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/host" id="hero-host-btn"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black text-white transition-all hover:brightness-110 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}>
                  <Monitor size={16} /> Host a Quiz <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center gap-5 justify-center text-sm text-white/40 mb-6">
            <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-blue-400" />Free to host</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-blue-400" />No account for students</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-blue-400" />Any device</span>
          </div>

          {/* Classroom mockup */}
          <ClassroomMockup />
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-8"
        style={{ background: 'rgba(37,99,235,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '500+',  l: 'Classrooms' },
            { n: '< 30s', l: 'Quiz created' },
            { n: '100%',  l: 'AI-explained' },
            { n: 'Free',  l: 'No card needed' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-2xl font-extrabold"
                style={{ background: 'linear-gradient(135deg, #2563eb, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {s.n}
              </div>
              <div className="text-white/45 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">From idea to live quiz in 3 steps</h2>
          <p className="text-white/40 text-sm">No prep time. No question writing. Just play.</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(37,99,235,0.3), transparent)' }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-blue-500/20"
                  style={{ background: 'rgba(37,99,235,0.12)' }}>
                  {step.icon}
                </div>
                <div className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-2">{step.step}</div>
                <h3 className="font-black text-white text-base mb-2">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRO UPGRADE — WHY GO PRO ─────────────────────────── */}
      <section className="py-20 px-6 border-y border-white/[0.06]"
        style={{ background: 'linear-gradient(to bottom, rgba(37,99,235,0.04), rgba(14,165,233,0.04))' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            {isPro ? (
              <>
                <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                  <CheckCircle size={13} /> Pro Active
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">You&apos;re on Pro — enjoy every feature!</h2>
                <p className="text-white/40 text-sm">Unlimited students, custom AI gen, analytics & exports are all unlocked.</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                  <Zap size={13} /> Teacher Pro — $6/mo
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Take your classroom further</h2>
                <p className="text-white/40 text-sm">Everything in free, plus the tools serious teachers need.</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {PRO_FEATURES.map(f => (
              <CardContainer key={f.title} containerClassName="w-full">
                <CardBody className="w-full">
                  <div
                    className="p-5 rounded-2xl border border-blue-500/15 text-center w-full"
                    style={{ background: 'rgba(37,99,235,0.06)' }}
                  >
                    <CardItem translateZ={40}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-400 mx-auto mb-3"
                        style={{ background: 'rgba(37,99,235,0.15)' }}>
                        {f.icon}
                      </div>
                    </CardItem>
                    <CardItem translateZ={20}>
                      <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                    </CardItem>
                    <CardItem translateZ={10}>
                      <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            ))}
          </div>

          {!isPro && (
            <div className="text-center">
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-black text-white text-base transition-all hover:brightness-110 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}>
                {upgrading ? 'Redirecting...' : <>Upgrade to Pro — $6/mo <ArrowRight size={18} /></>}
              </button>
              <p className="text-white/30 text-xs mt-3">Cancel anytime. No contracts. Instant access.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Loved by teachers everywhere</h2>
          <p className="text-white/40 text-sm">Real feedback from real classrooms — not marketing copy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name}
              className="p-6 rounded-2xl border border-white/[0.07]"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div className="font-bold text-white text-sm">{t.name}</div>
                <div className="text-white/40 text-xs mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECT GRID ─────────────────────────────────────── */}
      <section id="subjects" className="py-16 px-6 max-w-5xl mx-auto border-t border-white/[0.06]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Pick any subject</h2>
          <p className="text-white/40 text-sm">AI writes all the questions — you just choose the topic</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {subjects.map(subject => (
            <Link
              key={subject.id}
              href={`/host?subject=${subject.id}`}
              className={`group ${theme.card} ${theme.cardHover} p-4 flex items-center gap-3 rounded-2xl border border-white/[0.07] hover:border-blue-500/30 transition-all`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{subject.icon}</span>
              <div className="min-w-0">
                <div className="font-semibold text-white text-sm">{subject.label}</div>
                <div className="text-white/30 text-xs truncate hidden sm:block">{subject.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/host" className={btn.primary + ' text-base px-10 py-4 font-black'}>
            Create a Custom Quiz <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/[0.06]"
        style={{ background: 'linear-gradient(to bottom, rgba(37,99,235,0.05), rgba(14,165,233,0.03))' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Your class is waiting.
          </h2>
          <p className="text-white/45 mb-8 text-base">
            Host your first quiz in 30 seconds. Free. No account needed for students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/host" className={btn.primary + ' text-base px-10 py-4 font-black'}>
              <Monitor size={18} /> Host a Quiz
            </Link>
            <Link href="/join" className={btn.secondary + ' text-base px-10 py-4 font-black'}>
              <Users size={18} /> Join with Code
            </Link>
          </div>
          {!isPro && (
            <div className="mt-8 pt-8 border-t border-white/[0.06]">
              <p className="text-white/40 text-sm mb-4">Want unlimited students + analytics?</p>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-white text-sm transition-all hover:brightness-110 hover:scale-105 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)' }}>
                {upgrading ? 'Redirecting...' : <>Go Pro — $6/mo <Zap size={15} /></>}
              </button>
              <p className="text-white/25 text-xs mt-2">Cancel anytime.</p>
            </div>
          )}
        </div>
      </section>

      <GuidedTour steps={QUESTLY_TOUR} storageKey="questly_tour_v1" accentColor="#3b82f6" />
    </div>
  )
}
