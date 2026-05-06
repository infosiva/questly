import Link from 'next/link'
import { ArrowRight, Zap, Users, CheckCircle, Monitor } from 'lucide-react'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import AdUnit from '@/components/AdUnit'

const HOW_IT_WORKS = [
  {
    icon: '🎯',
    step: '01',
    title: 'Host picks topic & difficulty',
    desc: 'Choose a subject, difficulty, and number of questions. Custom topics supported.',
  },
  {
    icon: '✨',
    step: '02',
    title: 'AI generates the quiz instantly',
    desc: 'Full quiz with questions, options, and explanations ready in seconds.',
  },
  {
    icon: '🏆',
    step: '03',
    title: 'Group joins & plays live',
    desc: 'Share the 6-character code. Players join on any device. Scores update live.',
  },
]

const USE_CASES = [
  { icon: '🏫', label: 'Teachers',     desc: 'Run live classroom quizzes on any curriculum topic' },
  { icon: '📚', label: 'Study groups', desc: 'Test each other on exam topics — AI does the hard work' },
  { icon: '🏢', label: 'Team building', desc: 'Engage your team with custom work-related quizzes' },
  { icon: '🏠', label: 'Family nights', desc: 'Perfect for all ages — AI adapts the difficulty' },
]

export default function HomePage() {
  const subjects = isAiTool(config) ? config.subjects : []

  return (
    <div className="overflow-hidden">

      {/* ── HERO — Live Session Energy ───────────────────────── */}
      <section className="relative px-6 pt-14 pb-20 text-center overflow-hidden">
        {/* Blue radial glow top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-[0.14] blur-3xl -z-10"
          style={{ background: 'radial-gradient(ellipse at top, #2563eb 0%, transparent 70%)' }} />

        <div className="max-w-3xl mx-auto">

          {/* Top badge row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
            {/* Green LIVE pulsing badge */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              LIVE
            </div>
            {/* Better than Kahoot badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Zap size={10} /> Better than Kahoot
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-black leading-[0.90] tracking-tight mb-6">
            <span className="block text-white text-5xl sm:text-6xl md:text-7xl">Run a live quiz</span>
            <span className="block text-5xl sm:text-6xl md:text-7xl"
              style={{ background: 'linear-gradient(135deg, #2563eb, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              in 30 seconds.
            </span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Pick a topic, AI writes all the questions — with explanations. Your class plays live on any device.
          </p>

          {/* Session join box — styled input UI */}
          <div className="flex items-center max-w-sm mx-auto mb-8 rounded-xl overflow-hidden border border-blue-500/30"
            style={{ background: 'rgba(7,13,26,0.80)', backdropFilter: 'blur(12px)' }}>
            <input
              type="text"
              readOnly
              placeholder="Enter session code"
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none font-mono tracking-widest"
            />
            <Link href="/join"
              className="px-5 py-3.5 text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: '#2563eb' }}>
              Join →
            </Link>
          </div>

          {/* Two CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/host"
              className="flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-black text-white transition-all hover:brightness-110 hover:scale-105"
              style={{ background: '#2563eb' }}>
              <Monitor size={18} /> Host a Quiz <ArrowRight size={18} />
            </Link>
            <Link href="/#how-it-works"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-8 py-4 text-base font-bold text-white hover:bg-white/[0.08] transition-all">
              See how it works
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center gap-5 justify-center text-sm text-white/40">
            <span className="flex items-center gap-1.5"><CheckCircle size={13} className={theme.textAccent} />Free to host</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={13} className={theme.textAccent} />No account for players</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={13} className={theme.textAccent} />Any device</span>
          </div>

        </div>
      </section>

      {/* ── STATS BAR — classroom metrics ───────────────────── */}
      <section className="border-y border-white/[0.06] py-8 glass">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '< 30s',  l: 'Quiz generated' },
            { n: '7',      l: 'Subject areas' },
            { n: '100%',   l: 'AI-explained answers' },
            { n: '£0',     l: 'Free to host' },
          ].map(s => (
            <div key={s.l}>
              <div className={`text-2xl font-extrabold ${theme.gradientText}`}>{s.n}</div>
              <div className="text-white/45 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS — horizontal timeline ──────────────── */}
      <section id="how-it-works" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">From idea to live quiz in 3 steps</h2>
          <p className="text-white/40 text-sm">No prep time. No question writing. Just play.</p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="relative text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-white/10`}
                  style={{ background: 'rgba(59,130,246,0.15)' }}>
                  {step.icon}
                </div>
                <div className={`text-[11px] font-black uppercase tracking-widest ${theme.textAccent} mb-2`}>{step.step}</div>
                <h3 className="font-black text-white text-base mb-2">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES — who's it for ─────────────────────────── */}
      <section className="py-16 px-6 glass border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Who uses QuizBites?</h2>
            <p className="text-white/40 text-sm">From classrooms to boardrooms</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {USE_CASES.map(u => (
              <div key={u.label} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center">
                <div className="text-4xl mb-3">{u.icon}</div>
                <h3 className="font-bold text-white text-sm mb-2">{u.label}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECT GRID ────────────────────────────────────── */}
      <section id="subjects" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Pick any subject</h2>
          <p className="text-white/40 text-sm">AI writes all the questions — you just pick the topic</p>
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

      {/* ── AD UNIT ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <AdUnit slot="homepage-mid" format="banner" />
      </div>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 glass border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Your class is waiting.
          </h2>
          <p className="text-white/45 mb-8 text-base">
            Host your first quiz in 30 seconds. Free. No account needed for players.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/host" className={btn.primary + ' text-base px-10 py-4 font-black'}>
              <Monitor size={18} /> Host a Quiz
            </Link>
            <Link href="/join" className={btn.secondary + ' text-base px-10 py-4 font-black'}>
              <Users size={18} /> Join with Code
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
