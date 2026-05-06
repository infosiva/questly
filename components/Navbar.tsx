'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import config from '@/vertical.config'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-blue-900/30"
      style={{ background: 'rgba(7,13,26,0.85)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo — professional teacher-tool */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-xl leading-none">🖥️</span>
          <div>
            <span className="font-bold text-lg text-white leading-none block tracking-tight">{config.name}</span>
            <span className="text-[10px] font-medium text-blue-400/60 leading-none block uppercase tracking-widest">Live AI Quizzes</span>
          </div>
        </Link>

        {/* Desktop nav — simple text with blue hover */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <Link href="/#how-it-works" className="hover:text-blue-300 transition-colors">How it works</Link>
          <Link href="/#subjects" className="hover:text-blue-300 transition-colors">Subjects</Link>
        </div>

        {/* Two distinct CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Join Session — outline with green live dot */}
          <Link href="/join"
            className="flex items-center gap-2 rounded-lg border border-blue-500/50 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-500/10 hover:border-blue-400 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Join Session
          </Link>
          {/* Host a Quiz — solid blue */}
          <Link href="/host"
            className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-bold text-white transition-all hover:brightness-110 hover:scale-105"
            style={{ background: '#2563eb' }}>
            Host a Quiz <ArrowRight size={14} />
          </Link>
        </div>

        <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-blue-900/20 px-6 py-4 flex flex-col gap-4 text-sm"
          style={{ background: 'rgba(7,13,26,0.97)' }}>
          <Link href="/#how-it-works" className="text-white/70 hover:text-blue-300 transition-colors" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/#subjects" className="text-white/70 hover:text-blue-300 transition-colors" onClick={() => setOpen(false)}>Subjects</Link>
          <Link href="/join"
            className="flex items-center justify-center gap-2 rounded-lg border border-blue-500/50 py-2.5 font-semibold text-white"
            onClick={() => setOpen(false)}>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Join a Session
          </Link>
          <Link href="/host"
            className="text-center rounded-lg py-2.5 font-bold text-white"
            style={{ background: '#2563eb' }}
            onClick={() => setOpen(false)}>
            Host a Quiz
          </Link>
        </div>
      )}
    </nav>
  )
}
