import Link from 'next/link'

const steps = [
  { n: '1', t: 'Tell us about your trip', d: 'Where, when, your budget and how you like to travel.' },
  { n: '2', t: 'Meet people who know the way', d: 'Local guides, drivers, hosts and travelers who just came back.' },
  { n: '3', t: 'Go together', d: 'Contact them directly. No middlemen, no booking fees.' },
]

const perks = [
  { e: '✅', t: 'Verified locals', d: 'IDs and pages are checked by hand before a profile gets the badge.' },
  { e: '💸', t: 'Real budgets', d: 'Travelers share what they actually spent, day by day.' },
  { e: '🤝', t: 'Travel buddies', d: 'Find people heading the same way and join their trip.' },
]

export default function Home() {
  return (
    <main>
      <section className="bb-hero">
        <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#17509A" />
              <stop offset=".55" stopColor="#5FA0D8" />
              <stop offset=".85" stopColor="#F5D79A" />
            </linearGradient>
          </defs>
          <rect width="1200" height="700" fill="url(#sky)" />
          <circle cx="880" cy="430" r="62" fill="#FBE3A4" />
          <path d="M0 470 L120 400 L230 455 L380 360 L520 450 L650 390 L800 460 L960 380 L1100 450 L1200 410 V700 H0Z" fill="#4E6EA3" />
          <path d="M0 520 Q200 450 420 500 T820 490 T1200 480 V700 H0Z" fill="#C79A44" />
          <path d="M0 580 Q300 520 600 570 T1200 555 V700 H0Z" fill="#8C9A3F" />
          <path d="M0 650 Q400 600 800 640 T1200 625 V700 H0Z" fill="#5E6E2B" />
          <g transform="translate(900 520)">
            <path d="M-70 60 V0 Q-70 -20 -40 -22 H40 Q70 -20 70 0 V60Z" fill="#F7F3E8" />
            <path d="M-82 -14 Q0 -78 82 -14 Z" fill="#FFFFFF" />
            <rect x="-14" y="8" width="28" height="52" rx="4" fill="#D9552B" />
            <rect x="-5" y="-52" width="10" height="12" fill="#D9552B" />
          </g>
        </svg>
        <div className="bb-hero-in">
          <h1 className="bb-h1">Mongolia is better with someone who knows it.</h1>
          <p className="bb-sub">
            Meet local guides, drivers and hosts, and travelers who just came back.
            Free to use, no middlemen.
          </p>
          <div className="bb-btns">
            <Link href="/login" className="bb-btn">Join Blue Bridge</Link>
            <Link href="#how" className="bb-btn ghost">How it works</Link>
          </div>
        </div>
      </section>

      <section id="how" className="bb-wrap">
        <h2 className="bb-h2">How it works</h2>
        <div className="bb-grid">
          {steps.map((s) => (
            <article key={s.n} className="bb-card">
              <span className="bb-num">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bb-wrap" style={{ paddingTop: 0 }}>
        <h2 className="bb-h2">Why Blue Bridge</h2>
        <div className="bb-grid">
          {perks.map((p) => (
            <article key={p.t} className="bb-card">
              <span className="bb-emoji">{p.e}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bb-wrap" style={{ paddingTop: 0 }}>
        <div className="bb-cta">
          <h2 className="bb-h2">Ready for the steppe?</h2>
          <Link href="/login" className="bb-btn">Create a free account</Link>
        </div>
      </section>
    </main>
  )
}