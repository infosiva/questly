'use client'
import { useEffect, useRef, useState } from 'react'

interface AdUnitProps {
  size?: 'banner' | 'rectangle'
  className?: string
}

// ── Adsterra keys for quizbites.app (approved 2026-05-04) ───────────────────
const ADSTERRA_KEY_RECT   = '1753338cf4100ee950b4ab7fa495580a'  // 300×250
const ADSTERRA_KEY_BANNER = 'a43616513958134eaae287099c00b50c'  // 728×90

// ── Affiliate banners — earn commission immediately, no approval needed ──────
const AFFILIATE_BANNERS = [
  {
    label: 'Hostinger',
    bg: 'from-[#673DE6]/20 to-[#4B2DB5]/10',
    border: 'border-[#673DE6]/30',
    icon: '🚀',
    headline: 'Web Hosting from $1.99/mo',
    sub: 'Blazing fast • Free domain • 99.9% uptime',
    cta: 'Get Started →',
    ctaColor: 'bg-[#673DE6]',
    url: 'https://www.hostinger.com/web-hosting?REFERRALCODE=1SIVA54',
  },
  {
    label: 'Namecheap',
    bg: 'from-[#DE3C21]/20 to-[#E8630A]/10',
    border: 'border-[#DE3C21]/30',
    icon: '🌐',
    headline: 'Domains from $0.99',
    sub: 'Free WhoisGuard • Easy DNS • SSL included',
    cta: 'Find Your Domain →',
    ctaColor: 'bg-[#DE3C21]',
    url: 'https://www.namecheap.com/?aff=137589',
  },
  {
    label: 'Coursera',
    bg: 'from-[#0056D2]/20 to-[#003594]/10',
    border: 'border-[#0056D2]/30',
    icon: '🎓',
    headline: 'Learn from Top Universities',
    sub: 'AI • Data Science • Business — Free trials available',
    cta: 'Explore Courses →',
    ctaColor: 'bg-[#0056D2]',
    url: 'https://www.coursera.org/?utm_source=quizbites&utm_medium=referral',
  },
  {
    label: 'Amazon',
    bg: 'from-[#FF9900]/20 to-[#E47911]/10',
    border: 'border-[#FF9900]/30',
    icon: '📦',
    headline: 'Amazon Prime — 30 Days Free',
    sub: 'Movies • Music • Fast delivery • Unlimited reading',
    cta: 'Start Free Trial →',
    ctaColor: 'bg-[#FF9900] text-black',
    url: 'https://www.amazon.com/prime?tag=quizbites-20',
  },
]

function AffiliateBanner({ size }: { size: 'banner' | 'rectangle' }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % AFFILIATE_BANNERS.length), 8000)
    return () => clearInterval(t)
  }, [])
  const b = AFFILIATE_BANNERS[idx]
  if (size === 'banner') {
    return (
      <a href={b.url} target="_blank" rel="noopener noreferrer sponsored"
        className={`flex items-center gap-4 w-full px-5 py-3 rounded-xl bg-gradient-to-r ${b.bg} border ${b.border} hover:opacity-90 transition-opacity`}
        style={{ minHeight: 60 }}>
        <span className="text-2xl">{b.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm truncate">{b.headline}</div>
          <div className="text-white/50 text-xs truncate">{b.sub}</div>
        </div>
        <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg text-white ${b.ctaColor}`}>{b.cta}</span>
      </a>
    )
  }
  return (
    <a href={b.url} target="_blank" rel="noopener noreferrer sponsored"
      className={`flex flex-col gap-2 w-full px-5 py-4 rounded-xl bg-gradient-to-br ${b.bg} border ${b.border} hover:opacity-90 transition-opacity`}
      style={{ minHeight: 180 }}>
      <span className="text-3xl">{b.icon}</span>
      <div className="text-white font-bold text-base">{b.headline}</div>
      <div className="text-white/50 text-sm">{b.sub}</div>
      <span className={`mt-auto self-start text-xs font-bold px-3 py-1.5 rounded-lg text-white ${b.ctaColor}`}>{b.cta}</span>
    </a>
  )
}

// Social Bar — sticky bottom bar, injected once into body
export function SocialBar() {
  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    const s = document.createElement('script')
    s.async = true
    s.setAttribute('data-cfasync', 'false')
    s.src = '//pl29337037.profitablecpmratenetwork.com/47/d0/82/47d082af8dd8cdfba26e03857d3b001c.js'
    document.body.appendChild(s)
  }, [])
  return null
}

export default function AdUnit({ size = 'rectangle', className = '' }: AdUnitProps) {
  const adKey  = size === 'banner' ? ADSTERRA_KEY_BANNER : ADSTERRA_KEY_RECT
  const width  = size === 'banner' ? 728 : 300
  const height = size === 'banner' ? 90  : 250
  const ref    = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    loaded.current = true
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.setAttribute('data-cfasync', 'false')
    s.text = `(function(){var o={key:'${adKey}',format:'iframe',height:${height},width:${width},params:{}};var d=document.createElement('script');d.type='text/javascript';d.setAttribute('data-cfasync','false');d.src='//www.highperformanceformat.com/${adKey}/invoke.js';var c=document.currentScript||document.scripts[document.scripts.length-1];c.parentNode.insertBefore(d,c.nextSibling);window.atOptions=o;})();`
    ref.current.appendChild(s)
  }, [adKey, height, width])

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="text-[9px] text-white/10 text-center mb-0.5 uppercase tracking-widest">Sponsored</div>
      <div ref={ref} style={{ width, maxWidth: '100%', minHeight: height }} />
    </div>
  )
}
