import Link from 'next/link'
import { ArrowRight, Zap, Users, Brain, Trophy, CheckCircle } from 'lucide-react'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'

const HOW_IT_WORKS = [
  {
    icon: '🎯',
    step: '1',
    title: 'Host picks topic & difficulty',
    desc: 'Choose a subject, set the difficulty level, and pick how many questions. Add a custom topic for precision.',
  },
  {
    icon: '✨',
    step: '2',
    title: 'AI generates the quiz instantly',
    desc: 'Our AI quest master writes all the questions, multiple-choice options, and explanations in seconds.',
  },
  {
    icon: '🏆',
    step: '3',
    title: 'Group joins & plays live',
    desc: 'Share the 6-character session code. Players join on any device. Host controls the pace. Scores update live.',
  },
]

const USE_CASES = [
  { icon: '🏫', label: 'Teachers', desc: 'Run live classroom quizzes on any curriculum topic' },
  { icon: '📚', label: 'Study groups', desc: 'Test each other on exam topics — AI does the hard work' },
  { icon: '🏢', label: 'Team building', desc: 'Engage your team with custom work-related quizzes' },
  { icon: '🏠', label: 'Family nights', desc: 'Perfect for all ages — AI adapts the difficulty' },
]

export default function HomePage() {
  const subjects = isAiTool(config) ? config.subjects : []

  return (
    <div className="overflow-hidden">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative px-6 pt-20 pb-28 max-w-6xl mx-auto text-center">
        {/* Decorative blob */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-15 blur-3xl -z-10 bg-gradient-to-br ${theme.gradient}`} />

        <div className="fade-up max-w-4xl mx-auto">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-6`}>
            <Zap size={12} />
            Better than Kahoot — AI explains every answer
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="text-white">Start a </span>
            <span className={theme.gradientText}>Quest</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/55 text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Pick a topic, set difficulty, and AI generates a live quiz session for your group — answers explained as you go.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/host" className={btn.primary + ' text-base px-8 py-4'}>
              Host a Session <ArrowRight size={18} />
            </Link>
            <Link href="/join" className={btn.secondary + ' text-base px-8 py-4'}>
              Join a Session
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center gap-6 justify-center text-sm text-white/45">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} />Free to start</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} />No account required</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} />Any device, any browser</span>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
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

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How {config.name} works</h2>
          <p className="text-white/45 text-lg">From idea to live quiz in under a minute</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map(step => (
            <div key={step.step} className={`${theme.card} p-8 text-center`}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-3xl mx-auto mb-5`}>
                {step.icon}
              </div>
              <div className={`text-xs font-bold ${theme.textAccent} mb-2 uppercase tracking-widest`}>Step {step.step}</div>
              <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS ────────────────────────────────────────── */}
      <section id="subjects" className="py-20 px-6 glass border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Quiz on anything</h2>
            <p className="text-white/45 text-lg">7 subject areas — or enter any custom topic you like</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map(subject => (
              <Link
                key={subject.id}
                href={`/host?subject=${subject.id}`}
                className={`${theme.card} ${theme.cardHover} ${theme.glowHover} p-5 flex flex-col gap-2 group cursor-pointer`}
              >
                <span className="text-3xl">{subject.icon}</span>
                <span className="font-semibold text-white">{subject.label}</span>
                <span className="text-white/45 text-xs leading-snug">{subject.desc}</span>
                <span className={`text-xs ${theme.textAccent} mt-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Host a quiz →
                </span>
              </Link>
            ))}
            <Link
              href="/host"
              className={`${theme.card} ${theme.cardHover} p-5 flex flex-col gap-3 items-center justify-center group`}
            >
              <span className="text-3xl">✏️</span>
              <span className="font-semibold text-white/60 text-sm text-center">Custom topic</span>
              <span className="text-white/35 text-xs text-center">Enter any topic you like</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── USE CASES ───────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Who plays Questly?</h2>
          <p className="text-white/45 text-lg">For teachers · Study groups · Team building · Family nights</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {USE_CASES.map(u => (
            <div key={u.label} className={`${theme.card} p-6 flex gap-4 items-start`}>
              <span className="text-3xl flex-shrink-0">{u.icon}</span>
              <div>
                <h4 className="font-semibold text-white mb-1">{u.label}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY QUESTLY ─────────────────────────────────────── */}
      <section className="py-20 px-6 glass border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Why {config.name}?</h2>
            <p className="text-white/45 text-lg">Not just trivia — it&apos;s learning disguised as a game</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Brain size={22} />,   title: 'AI-generated questions',  desc: 'No question bank to run dry. Every session is unique, generated fresh by AI on your exact topic.' },
              { icon: <Zap size={22} />,     title: 'Live & real-time',        desc: 'Players see questions at the same moment. Host controls pace. Results update as answers come in.' },
              { icon: <CheckCircle size={22} />, title: 'Every answer explained', desc: 'Unlike Kahoot, Questly explains every correct answer. Players actually learn, not just compete.' },
              { icon: <Users size={22} />,   title: 'No app download needed', desc: 'Players join from any browser on any device — phone, tablet, laptop. Just share the code.' },
              { icon: <Trophy size={22} />,  title: 'Live leaderboard',        desc: 'Scores update after every question. The leaderboard keeps everyone engaged till the final question.' },
              { icon: <ArrowRight size={22} />, title: 'One-click session setup', desc: 'Host sets up a full quiz session in under a minute. Pick topic, difficulty, questions — done.' },
            ].map(f => (
              <div key={f.title} className={`${theme.card} p-5 flex gap-4 items-start`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${theme.solidLight} flex items-center justify-center ${theme.textAccent}`}>
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{f.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className={`max-w-3xl mx-auto text-center glass rounded-3xl p-12 border ${theme.border} relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 rounded-3xl`} />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 relative">
            Ready to run your first Quest?
          </h2>
          <p className="text-white/50 mb-8 text-lg relative">
            Free to host. No account needed. AI builds the quiz in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link href="/host" className={btn.primary + ' text-base px-10 py-4'}>
              Host a Session <ArrowRight size={18} />
            </Link>
            <Link href="/join" className={btn.secondary + ' text-base px-8 py-4'}>
              Join with a code
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
