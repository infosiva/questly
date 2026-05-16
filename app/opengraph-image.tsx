import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'QuizBites — Run a Live AI Quiz in 30 Seconds'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          background: 'linear-gradient(135deg, #020817 0%, #1e3a8a 60%, #1e1b4b 100%)',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ background: '#3b82f6', borderRadius: 99, padding: '8px 20px', fontSize: 18, fontWeight: 800, color: '#fff' }}>
            Free Kahoot Alternative
          </div>
          <div style={{ color: '#93c5fd', fontSize: 18, fontWeight: 600 }}>No account needed for players</div>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 72, fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 900 }}>
          Run a live quiz{'\n'}
          <span style={{ color: '#60a5fa' }}>in 30 seconds.</span>
        </div>

        {/* Sub */}
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.55)', fontWeight: 400, marginBottom: 48, maxWidth: 700 }}>
          AI writes all the questions. Real-time scoring. Works in classrooms, offices, family nights.
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 12, padding: '10px 24px', color: '#93c5fd', fontSize: 20, fontWeight: 700 }}>
            quizbites.app
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>Better than Kahoot · Free forever</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
