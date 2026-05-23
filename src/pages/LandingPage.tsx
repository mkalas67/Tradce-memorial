import { useState, type FormEvent } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const ENQUIRY_EMAIL = import.meta.env.VITE_ENQUIRY_EMAIL ?? 'hello@trace.memorial'

// ── Design tokens ─────────────────────────────────────────────────────────────

const C = {
  slate:     '#1E2B3C',
  gold:      '#C9943A',
  cream:     '#F8F6F2',
  parchment: '#F2EDE3',
  ash:       '#8A9BB0',
  body:      '#4A5568',
  border:    '#E8E4DC',
  muted:     '#7A8A9A',
}

// ── Memorial page palettes ────────────────────────────────────────────────────

const PALETTES = [
  { name: 'Meadow',   accent: '#4a7c59', bg: '#f0f7f0', panel: '#e6f0e6' },
  { name: 'Ocean',    accent: '#2a6496', bg: '#f0f5fa', panel: '#e0ecf4' },
  { name: 'Sunset',   accent: '#c0673b', bg: '#fdf5f0', panel: '#fae8dc' },
  { name: 'Lavender', accent: '#7c5c9e', bg: '#f7f0fb', panel: '#ede0f7' },
  { name: 'Golden',   accent: '#b8860b', bg: '#fdfaf0', panel: '#f7f0d8' },
  { name: 'Rose',     accent: '#b5507a', bg: '#fdf0f5', panel: '#f7dcea' },
]

// ── Shared form styles ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: '11px 14px',
  fontSize: 14,
  fontFamily: 'inherit',
  color: C.slate,
  background: 'white',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: C.muted,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontFamily: '"Trebuchet MS", sans-serif',
}

// ── Decorative leaf mark ──────────────────────────────────────────────────────

function Leaf({
  size = 32,
  color = C.gold,
  style: sx = {},
}: {
  size?: number
  color?: string
  style?: React.CSSProperties
}) {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 32 40" fill="none" style={sx}>
      <path
        d="M16 38 C16 38, 2 28, 2 15 C2 7, 8 2, 16 2 C24 2, 30 7, 30 15 C30 28, 16 38, 16 38Z"
        fill={color}
      />
      <path
        d="M16 36 L16 6"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Navigation ────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Leaf size={18} color={C.gold} />
        <span
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 17,
            fontWeight: 600,
            color: C.slate,
            letterSpacing: '-0.3px',
          }}
        >
          trace<span style={{ color: C.ash }}>.memorial</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a
          href="#counsellor"
          style={{
            color: C.body,
            fontSize: 13,
            textDecoration: 'none',
            fontFamily: '"Trebuchet MS", sans-serif',
            fontWeight: 500,
          }}
        >
          Work with a counsellor
        </a>
        <a
          href="#self-service"
          style={{
            background: C.gold,
            color: 'white',
            padding: '8px 18px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: '"Trebuchet MS", sans-serif',
          }}
        >
          Create it yourself, $99
        </a>
      </div>
    </nav>
  )
}

// ── Memorial page mockup card ─────────────────────────────────────────────────

function MemorialCard({
  name,
  accent,
  bg,
  panel,
}: {
  name: string
  accent: string
  bg: string
  panel: string
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(30,43,60,0.08)',
        border: `1px solid ${panel}`,
      }}
    >
      <div style={{ background: panel, padding: '18px 16px 14px' }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: accent,
            marginBottom: 10,
          }}
        />
        <div style={{ height: 9, background: accent, borderRadius: 5, width: '62%', marginBottom: 6 }} />
        <div style={{ height: 6, background: `${accent}60`, borderRadius: 4, width: '42%' }} />
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        {[80, 90, 65, 75].map((w, i) => (
          <div
            key={i}
            style={{
              height: 6,
              background: `${accent}22`,
              borderRadius: 3,
              width: `${w}%`,
              marginBottom: i < 3 ? 6 : 0,
            }}
          />
        ))}
        <div
          style={{
            display: 'flex',
            gap: 4,
            marginTop: 14,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: accent,
              fontFamily: '"Trebuchet MS", sans-serif',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {name}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[accent, panel, bg].map((col, i) => (
              <div
                key={i}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  background: col,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Form state types ──────────────────────────────────────────────────────────

interface CounsellorFormState {
  name: string
  email: string
  petName: string
  petType: string
  message: string
}

interface SelfServiceFormState {
  name: string
  email: string
  petName: string
  petType: string
}

const EMPTY_C: CounsellorFormState = { name: '', email: '', petName: '', petType: '', message: '' }
const EMPTY_S: SelfServiceFormState = { name: '', email: '', petName: '', petType: '' }

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [cForm, setCForm] = useState<CounsellorFormState>(EMPTY_C)
  const [cStatus, setCStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [sForm, setSForm] = useState<SelfServiceFormState>(EMPTY_S)
  const [sStatus, setSStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  function setC(field: keyof CounsellorFormState, value: string) {
    setCForm(prev => ({ ...prev, [field]: value }))
  }

  function setS(field: keyof SelfServiceFormState, value: string) {
    setSForm(prev => ({ ...prev, [field]: value }))
  }

  async function submitCounsellor(e: FormEvent) {
    e.preventDefault()
    setCStatus('submitting')
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...cForm,
        createdAt: Date.now(),
        source: 'landing-page',
      })
      const subject = encodeURIComponent(`trace.memorial enquiry for ${cForm.petName || 'a pet'}`)
      const body = encodeURIComponent(
        `Name: ${cForm.name}\nEmail: ${cForm.email}\nPet: ${cForm.petName} (${cForm.petType})\n\n${cForm.message}`
      )
      window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`
      setCForm(EMPTY_C)
      setCStatus('done')
    } catch {
      setCStatus('error')
    }
  }

  async function submitSelfService(e: FormEvent) {
    e.preventDefault()
    setSStatus('submitting')
    try {
      await addDoc(collection(db, 'self-service-orders'), {
        ...sForm,
        price: 99,
        durationYears: 3,
        status: 'pending-payment',
        createdAt: Date.now(),
      })
      setSForm(EMPTY_S)
      setSStatus('done')
    } catch {
      setSStatus('error')
    }
  }

  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: C.slate, background: C.cream }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(165deg, ${C.cream} 0%, ${C.parchment} 100%)`,
          overflow: 'hidden',
          padding: '110px 32px 72px',
        }}
      >
        <Nav />

        {/* Decorative leaves */}
        <Leaf size={130} color={C.gold} style={{ position: 'absolute', top: '6%', right: '5%', opacity: 0.1, transform: 'rotate(22deg)', pointerEvents: 'none' }} />
        <Leaf size={80}  color={C.ash}  style={{ position: 'absolute', bottom: '10%', left: '4%', opacity: 0.09, transform: 'rotate(-18deg)', pointerEvents: 'none' }} />
        <Leaf size={48}  color={C.gold} style={{ position: 'absolute', top: '32%', left: '7%', opacity: 0.07, transform: 'rotate(8deg)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 660, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22 }}>
            <Leaf size={18} color={C.gold} />
            <p
              style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: C.muted,
                fontFamily: '"Trebuchet MS", sans-serif',
                margin: 0,
              }}
            >
              A permanent memorial for the pets we love
            </p>
          </div>

          <h1
            style={{
              fontSize: 'clamp(34px, 5.5vw, 56px)',
              fontWeight: 700,
              color: C.slate,
              lineHeight: 1.15,
              margin: '0 0 20px',
              letterSpacing: '-1px',
            }}
          >
            They deserve more than a moment.
            <br />
            <span style={{ color: C.gold }}>Give them a permanent home.</span>
          </h1>

          <p
            style={{
              fontSize: 16,
              color: C.body,
              lineHeight: 1.85,
              maxWidth: 500,
              margin: '0 auto 40px',
              fontFamily: '"Trebuchet MS", sans-serif',
              fontWeight: 300,
            }}
          >
            trace.memorial creates beautiful, permanent pages for the pets you loved.
            Guided by a trained pet bereavement counsellor, or built by you yourself.
            Kept forever.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#counsellor"
              style={{
                display: 'inline-block',
                background: C.slate,
                color: 'white',
                padding: '13px 30px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: '"Trebuchet MS", sans-serif',
              }}
            >
              Work with a counsellor
            </a>
            <a
              href="#self-service"
              style={{
                display: 'inline-block',
                background: C.gold,
                color: 'white',
                padding: '13px 30px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: '"Trebuchet MS", sans-serif',
              }}
            >
              Create it yourself, $99
            </a>
          </div>
        </div>

        <div style={{ marginTop: 56, width: '100%', maxWidth: 580, position: 'relative' }}>
          <img
            src="/visuals/trace-memorial-post-hero.png"
            alt="A trace.memorial page"
            style={{
              width: '100%',
              borderRadius: 20,
              boxShadow: '0 20px 60px rgba(30,43,60,0.13)',
              display: 'block',
            }}
          />
        </div>
      </section>

      {/* ── Two paths ─────────────────────────────────────────────────────── */}
      <section style={{ background: 'white', padding: '80px 32px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: C.muted,
              marginBottom: 12,
              textAlign: 'center',
              fontFamily: '"Trebuchet MS", sans-serif',
            }}
          >
            Two ways to create a memorial
          </p>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: C.slate,
              marginBottom: 48,
              letterSpacing: '-0.3px',
              textAlign: 'center',
            }}
          >
            Choose the path that is right for you
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>

            {/* Counsellor path */}
            <div
              style={{
                background: C.cream,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: '40px 36px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <Leaf size={22} color={C.slate} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: C.muted,
                    fontFamily: '"Trebuchet MS", sans-serif',
                  }}
                >
                  With a counsellor
                </span>
              </div>
              <h3 style={{ fontSize: 21, fontWeight: 700, color: C.slate, marginBottom: 14, lineHeight: 1.3 }}>
                A guided journey through grief and remembrance
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: C.body,
                  lineHeight: 1.85,
                  marginBottom: 28,
                  fontFamily: '"Trebuchet MS", sans-serif',
                  fontWeight: 300,
                }}
              >
                A trained pet bereavement counsellor guides you through the TRACE method
                over five sessions. Together you tell your pet's full story, honour the bond,
                and build a memorial page that reflects everything they meant to you.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Five therapeutic sessions with a certified counsellor',
                  'The full TRACE bereavement framework',
                  'Counsellor-built memorial page',
                  'Permanent hosting, shared at your own pace',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: C.body, fontFamily: '"Trebuchet MS", sans-serif' }}>
                    <span style={{ color: C.gold, marginTop: 1, flexShrink: 0 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#counsellor"
                style={{
                  display: 'inline-block',
                  background: C.slate,
                  color: 'white',
                  padding: '12px 28px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: '"Trebuchet MS", sans-serif',
                }}
              >
                Enquire about counsellor sessions
              </a>
            </div>

            {/* Self-service path */}
            <div
              style={{
                background: C.parchment,
                border: `2px solid ${C.gold}35`,
                borderRadius: 20,
                padding: '40px 36px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <Leaf size={22} color={C.gold} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: C.muted,
                    fontFamily: '"Trebuchet MS", sans-serif',
                  }}
                >
                  Self-service
                </span>
              </div>
              <h3 style={{ fontSize: 21, fontWeight: 700, color: C.slate, marginBottom: 14, lineHeight: 1.3 }}>
                Build their memorial page yourself
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: C.body,
                  lineHeight: 1.85,
                  marginBottom: 28,
                  fontFamily: '"Trebuchet MS", sans-serif',
                  fontWeight: 300,
                }}
              >
                You know their story better than anyone. Fill in the details at your own pace,
                choose a palette, upload your photos, and we will build a beautiful permanent
                page for them. No sessions required.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'You provide the content at your own pace',
                  'Choose from nine colour palettes',
                  'Three years permanent hosting',
                  'Simple, shareable page address',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: C.body, fontFamily: '"Trebuchet MS", sans-serif' }}>
                    <span style={{ color: C.gold, marginTop: 1, flexShrink: 0 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <a
                  href="#self-service"
                  style={{
                    display: 'inline-block',
                    background: C.gold,
                    color: 'white',
                    padding: '12px 28px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: '"Trebuchet MS", sans-serif',
                  }}
                >
                  Get started, $99
                </a>
                <span style={{ fontSize: 12, color: C.muted, fontFamily: '"Trebuchet MS", sans-serif' }}>
                  Three years hosting included
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section style={{ background: C.cream, padding: '72px 32px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 20, fontFamily: '"Trebuchet MS", sans-serif' }}>
            About trace.memorial
          </p>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: C.slate, marginBottom: 24, lineHeight: 1.25, letterSpacing: '-0.5px' }}>
            A life told in full.
            <br />A bond honoured properly.
          </h2>
          <p style={{ fontSize: 15, color: C.body, lineHeight: 1.9, fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 300 }}>
            When we lose a pet, the grief is real and often unacknowledged by the world around us.
            trace.memorial exists to change that. Every page is built around the TRACE method, a
            therapeutic framework developed by the Academy for Pet Loss, designed to help tell your
            pet's story fully, honour the bond you shared, and create something lasting from the
            love that remains.
          </p>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section style={{ background: 'white', padding: '72px 32px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 40, textAlign: 'center', fontFamily: '"Trebuchet MS", sans-serif' }}>
            The counsellor-guided process
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
            {[
              {
                n: '01',
                title: 'Your counsellor builds it with you',
                body: "A trained pet bereavement counsellor guides you through the TRACE method: five sessions that help you tell your pet's story, honour the bond you shared, and find a way to carry them forward.",
              },
              {
                n: '02',
                title: 'A page shaped around their life',
                body: 'Their name, their story, the things they loved, the moments you will never forget. Photographs, your words, a palette chosen for them. A permanent, beautiful page that is entirely theirs.',
              },
              {
                n: '03',
                title: 'Kept forever. Shared when you are ready.',
                body: 'Your memorial page lives permanently at a simple, shareable address. Share it with family, friends, anyone who loved them. Whenever and however feels right.',
              },
            ].map(step => (
              <div key={step.n} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: '"Trebuchet MS", sans-serif', minWidth: 24, paddingTop: 4 }}>
                  {step.n}
                </span>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: C.slate, marginBottom: 10, lineHeight: 1.3 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: C.body, lineHeight: 1.85, fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 300, margin: 0 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56, borderRadius: 16, overflow: 'hidden' }}>
            <img
              src="/visuals/trace-memorial-post-howitworks.png"
              alt="How trace.memorial works"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.parchment, padding: '72px 32px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 16, textAlign: 'center', fontFamily: '"Trebuchet MS", sans-serif' }}>
            Nine colour palettes to choose from
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: C.slate, marginBottom: 12, letterSpacing: '-0.3px', textAlign: 'center' }}>
            Beautiful. Personal. Permanent.
          </h2>
          <p style={{ fontSize: 14, color: C.body, lineHeight: 1.8, maxWidth: 500, margin: '0 auto 48px', textAlign: 'center', fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 300 }}>
            Every page has their name, story, photos, and a palette chosen to reflect who they were.
            The page lives permanently at a simple, shareable address.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {PALETTES.map(p => (
              <MemorialCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Counsellor enquiry form ────────────────────────────────────────── */}
      <section id="counsellor" style={{ background: C.cream, padding: '80px 32px' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <Leaf size={20} color={C.slate} />
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, fontFamily: '"Trebuchet MS", sans-serif', margin: 0 }}>
              Counsellor-guided memorial
            </p>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: C.slate, marginBottom: 10, letterSpacing: '-0.3px', textAlign: 'center' }}>
            Work with a trained counsellor
          </h2>
          <p style={{ fontSize: 14, color: C.body, lineHeight: 1.75, textAlign: 'center', marginBottom: 40, fontFamily: '"Trebuchet MS", sans-serif' }}>
            Tell us a little about your pet. One of our certified pet bereavement counsellors
            will be in touch to guide you through the rest.
          </p>

          {cStatus === 'done' ? (
            <div style={{ background: '#e6f0e6', border: '1px solid #b8d4b8', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#3a5f3a', marginBottom: 12 }}>Thank you</p>
              <p style={{ fontSize: 14, color: '#4a7c59', lineHeight: 1.75, fontFamily: '"Trebuchet MS", sans-serif' }}>
                We have received your enquiry and will be in touch within one working day.
              </p>
            </div>
          ) : (
            <form onSubmit={submitCounsellor} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input style={inputStyle} type="text" required value={cForm.name} onChange={e => setC('name', e.target.value)} placeholder="Jane Smith" />
                </div>
                <div>
                  <label style={labelStyle}>Your email</label>
                  <input style={inputStyle} type="email" required value={cForm.email} onChange={e => setC('email', e.target.value)} placeholder="jane@example.com" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Pet's name</label>
                  <input style={inputStyle} type="text" required value={cForm.petName} onChange={e => setC('petName', e.target.value)} placeholder="e.g. Bella" />
                </div>
                <div>
                  <label style={labelStyle}>Type of pet</label>
                  <input style={inputStyle} type="text" value={cForm.petType} onChange={e => setC('petType', e.target.value)} placeholder="e.g. Golden retriever" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Anything you would like to share</label>
                <textarea
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                  rows={4}
                  value={cForm.message}
                  onChange={e => setC('message', e.target.value)}
                  placeholder="Tell us a little about them, or anything else you would like us to know."
                />
              </div>
              {cStatus === 'error' && (
                <p style={{ fontSize: 13, color: '#c0673b', fontFamily: '"Trebuchet MS", sans-serif' }}>
                  Something went wrong. Please try again or email us at {ENQUIRY_EMAIL}.
                </p>
              )}
              <button
                type="submit"
                disabled={cStatus === 'submitting'}
                style={{
                  background: C.slate,
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '"Trebuchet MS", sans-serif',
                  opacity: cStatus === 'submitting' ? 0.6 : 1,
                }}
              >
                {cStatus === 'submitting' ? 'Sending...' : 'Send enquiry'}
              </button>
              <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', fontFamily: '"Trebuchet MS", sans-serif', lineHeight: 1.6 }}>
                We respond within one working day. Pages are built by certified Academy for Pet Loss
                counsellors as part of the TRACE pet bereavement programme.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Self-service section + form ────────────────────────────────────── */}
      <section id="self-service" style={{ background: C.parchment, padding: '80px 32px' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <Leaf size={20} color={C.gold} />
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, fontFamily: '"Trebuchet MS", sans-serif', margin: 0 }}>
              Self-service memorial
            </p>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: C.slate, marginBottom: 16, letterSpacing: '-0.3px', textAlign: 'center' }}>
            Create their memorial yourself
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div
              style={{
                background: C.gold,
                color: 'white',
                padding: '9px 22px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: '"Trebuchet MS", sans-serif',
              }}
            >
              $99 · three years hosting included
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.body, lineHeight: 1.75, textAlign: 'center', marginBottom: 16, fontFamily: '"Trebuchet MS", sans-serif' }}>
            Register your interest below and we will send you a simple content form to fill in at
            your own pace. We will build the page and it will live permanently at a shareable
            address for three years.
          </p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, textAlign: 'center', marginBottom: 40, fontFamily: '"Trebuchet MS", sans-serif' }}>
            No payment is taken now. You will receive a link to review the page before any charge
            is made.
          </p>

          {sStatus === 'done' ? (
            <div
              style={{
                background: '#fdfaf0',
                border: `1px solid ${C.gold}45`,
                borderRadius: 16,
                padding: '40px 32px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 20, fontWeight: 700, color: C.gold, marginBottom: 12 }}>We have your details</p>
              <p style={{ fontSize: 14, color: C.body, lineHeight: 1.75, fontFamily: '"Trebuchet MS", sans-serif' }}>
                We will be in touch within one working day with a link to the memorial content form.
              </p>
            </div>
          ) : (
            <form onSubmit={submitSelfService} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input style={inputStyle} type="text" required value={sForm.name} onChange={e => setS('name', e.target.value)} placeholder="Jane Smith" />
                </div>
                <div>
                  <label style={labelStyle}>Your email</label>
                  <input style={inputStyle} type="email" required value={sForm.email} onChange={e => setS('email', e.target.value)} placeholder="jane@example.com" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Pet's name</label>
                  <input style={inputStyle} type="text" required value={sForm.petName} onChange={e => setS('petName', e.target.value)} placeholder="e.g. Bella" />
                </div>
                <div>
                  <label style={labelStyle}>Type of pet</label>
                  <input style={inputStyle} type="text" value={sForm.petType} onChange={e => setS('petType', e.target.value)} placeholder="e.g. Golden retriever" />
                </div>
              </div>
              {sStatus === 'error' && (
                <p style={{ fontSize: 13, color: '#c0673b', fontFamily: '"Trebuchet MS", sans-serif' }}>
                  Something went wrong. Please try again or email us at {ENQUIRY_EMAIL}.
                </p>
              )}
              <button
                type="submit"
                disabled={sStatus === 'submitting'}
                style={{
                  background: C.gold,
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '"Trebuchet MS", sans-serif',
                  opacity: sStatus === 'submitting' ? 0.6 : 1,
                }}
              >
                {sStatus === 'submitting' ? 'Sending...' : 'Register interest, $99'}
              </button>
              <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', fontFamily: '"Trebuchet MS", sans-serif', lineHeight: 1.6 }}>
                No payment now. We confirm your order and share the content form first.
                Payment is requested once your page is ready to review.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ background: C.slate, padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <Leaf size={16} color={C.gold} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'white', margin: 0 }}>
            trace<span style={{ opacity: 0.5 }}>.memorial</span>
          </p>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: '"Trebuchet MS", sans-serif', marginBottom: 16 }}>
          A permanent home for the pets we have loved and lost.
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: '"Trebuchet MS", sans-serif' }}>
          Built by{' '}
          <a href="https://academyforpetloss.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>
            Academy for Pet Loss
          </a>
          .{' '}
          <a href="/login" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>
            Counsellor sign in
          </a>
        </p>
      </footer>

    </div>
  )
}
