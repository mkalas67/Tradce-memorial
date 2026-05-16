import { useState, type FormEvent } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const ENQUIRY_EMAIL = import.meta.env.VITE_ENQUIRY_EMAIL ?? 'hello@trace.memorial'

function Nav() {
  return (
    <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: 'white', letterSpacing: '-0.3px' }}>
        trace<span style={{ opacity: 0.6 }}>.memorial</span>
      </span>
      <a
        href="#enquire"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        Create a memorial
      </a>
    </nav>
  )
}

const steps = [
  {
    number: '01',
    title: 'Your counsellor builds it with you',
    body: 'A trained pet bereavement counsellor guides you through the TRACE method — five sessions that help you tell your pet\'s story, honour the bond you shared, and find a way to carry them forward.',
  },
  {
    number: '02',
    title: 'A page shaped around their life',
    body: 'Their name, their story, the things they loved, the moments you\'ll never forget. Photographs, your words, a palette chosen for them. A permanent, beautiful page that is entirely theirs.',
  },
  {
    number: '03',
    title: 'Kept forever. Shared whenever you\'re ready',
    body: 'Your memorial page lives permanently at a simple, shareable address. Share it with family, friends, anyone who loved them — whenever and however feels right.',
  },
]

interface FormState {
  name: string
  email: string
  petName: string
  petType: string
  message: string
}

const EMPTY: FormState = { name: '', email: '', petName: '', petType: '', message: '' }

export default function LandingPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...form,
        createdAt: Date.now(),
        source: 'landing-page',
      })

      // Open email client as notification
      const subject = encodeURIComponent(`trace.memorial enquiry — ${form.petName || 'new enquiry'}`)
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nPet: ${form.petName} (${form.petType})\n\n${form.message}`
      )
      window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`

      setForm(EMPTY)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #e7e5e4',
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#1c1917',
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#78716c',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1c1917' }}>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(160deg, #2d1f0e 0%, #4a3020 40%, #6b4c30 100%)', overflow: 'hidden' }}>
        <Nav />

        {/* Subtle texture overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(184,134,11,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto', padding: '120px 32px 80px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 28, fontFamily: '"Trebuchet MS", sans-serif' }}>
            A permanent memorial for your beloved pet
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 700, color: 'white', lineHeight: 1.15, margin: '0 0 24px', letterSpacing: '-1px' }}>
            They deserve more than a moment.<br />
            <span style={{ color: '#C9B99A' }}>Give them a permanent home.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px', fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 300 }}>
            trace.memorial is a beautiful, permanent page for the pet you loved. Built with care by a trained pet bereavement counsellor. Kept forever. Shared whenever you are ready.
          </p>
          <a
            href="#enquire"
            style={{ display: 'inline-block', background: '#b8860b', color: 'white', padding: '14px 36px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none', fontFamily: '"Trebuchet MS", sans-serif', letterSpacing: '0.02em' }}
          >
            Create a memorial
          </a>
        </div>
      </section>

      {/* What it is */}
      <section style={{ background: '#fdfaf0', padding: '80px 32px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: 20, fontFamily: '"Trebuchet MS", sans-serif' }}>
            What is trace.memorial
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1c1917', marginBottom: 24, lineHeight: 1.25, letterSpacing: '-0.5px' }}>
            A life told in full.<br />A bond honoured properly.
          </h2>
          <p style={{ fontSize: 16, color: '#57534e', lineHeight: 1.85, fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 300 }}>
            When we lose a pet, the grief is real — and often unacknowledged by the world around us.
            trace.memorial exists to change that. Every page is built through the TRACE method, a
            therapeutic framework developed by the Academy for Pet Loss, designed to help you tell
            your pet's story fully, honour the bond you shared, and create something lasting from
            the love that remains.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'white', padding: '80px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: 48, textAlign: 'center', fontFamily: '"Trebuchet MS", sans-serif' }}>
            How it works
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {steps.map(step => (
              <div key={step.number} style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#b8860b', fontFamily: '"Trebuchet MS", sans-serif', minWidth: 32, paddingTop: 4 }}>
                  {step.number}
                </span>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1c1917', marginBottom: 10, lineHeight: 1.3 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 15, color: '#57534e', lineHeight: 1.85, fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 300, margin: 0 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example page preview teaser */}
      <section style={{ background: '#f7f0d8', padding: '72px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: 20, fontFamily: '"Trebuchet MS", sans-serif' }}>
          What a page looks like
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1c1917', marginBottom: 16, letterSpacing: '-0.3px' }}>
          Beautiful. Personal. Permanent.
        </h2>
        <p style={{ fontSize: 15, color: '#57534e', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px', fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 300 }}>
          Every page has their name, their hero photo, the story of their life, the bond you shared,
          what you miss, their favourite things, a photo gallery, and a certificate marking the
          end of the TRACE journey. Counsellors choose from nine colour palettes and four fonts.
          The page lives at a simple, shareable address — forever.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {['Meadow', 'Ocean', 'Sunset', 'Lavender', 'Golden', 'Rose'].map(palette => (
            <span
              key={palette}
              style={{
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: 12,
                fontFamily: '"Trebuchet MS", sans-serif',
                background: {
                  Meadow: '#e6f0e6', Ocean: '#e0ecf4', Sunset: '#fae8dc',
                  Lavender: '#ede0f7', Golden: '#f7f0d8', Rose: '#f7dcea',
                }[palette],
                color: {
                  Meadow: '#4a7c59', Ocean: '#2a6496', Sunset: '#c0673b',
                  Lavender: '#7c5c9e', Golden: '#b8860b', Rose: '#b5507a',
                }[palette],
                fontWeight: 500,
              }}
            >
              {palette}
            </span>
          ))}
        </div>
      </section>

      {/* Enquiry form */}
      <section id="enquire" style={{ background: '#fdfaf0', padding: '80px 32px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a8a29e', marginBottom: 16, fontFamily: '"Trebuchet MS", sans-serif', textAlign: 'center' }}>
            Get started
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1c1917', marginBottom: 10, letterSpacing: '-0.3px', textAlign: 'center' }}>
            Create a memorial page
          </h2>
          <p style={{ fontSize: 14, color: '#78716c', lineHeight: 1.75, textAlign: 'center', marginBottom: 40, fontFamily: '"Trebuchet MS", sans-serif' }}>
            Tell us a little about your pet. One of our trained counsellors will be in touch to guide you through the rest.
          </p>

          {status === 'done' ? (
            <div style={{ background: '#e6f0e6', border: '1px solid #b8d4b8', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#3a5f3a', marginBottom: 12 }}>Thank you</p>
              <p style={{ fontSize: 14, color: '#4a7c59', lineHeight: 1.75, fontFamily: '"Trebuchet MS", sans-serif' }}>
                We have received your enquiry and will be in touch shortly to begin building their memorial.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input style={inputStyle} type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
                </div>
                <div>
                  <label style={labelStyle}>Your email</label>
                  <input style={inputStyle} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Pet's name</label>
                  <input style={inputStyle} type="text" required value={form.petName} onChange={e => set('petName', e.target.value)} placeholder="e.g. Bella" />
                </div>
                <div>
                  <label style={labelStyle}>Type of pet</label>
                  <input style={inputStyle} type="text" value={form.petType} onChange={e => set('petType', e.target.value)} placeholder="e.g. Golden retriever" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Anything you'd like to share</label>
                <textarea
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                  rows={4}
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Tell us a little about them, or anything else you'd like us to know before we get in touch."
                />
              </div>

              {status === 'error' && (
                <p style={{ fontSize: 13, color: '#c0673b', fontFamily: '"Trebuchet MS", sans-serif' }}>
                  Something went wrong. Please try again or email us directly at {ENQUIRY_EMAIL}.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{ background: '#1c1917', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Trebuchet MS", sans-serif', opacity: status === 'submitting' ? 0.6 : 1 }}
              >
                {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
              </button>

              <p style={{ fontSize: 12, color: '#a8a29e', textAlign: 'center', fontFamily: '"Trebuchet MS", sans-serif', lineHeight: 1.6 }}>
                We will respond within one working day. Pages are built by trained Academy for Pet Loss counsellors — part of the TRACE pet bereavement programme.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#2d1f0e', padding: '40px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 8 }}>
          trace<span style={{ opacity: 0.5 }}>.memorial</span>
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: '"Trebuchet MS", sans-serif', marginBottom: 16 }}>
          A permanent home for the pets we have loved and lost.
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: '"Trebuchet MS", sans-serif' }}>
          Built by{' '}
          <a href="https://academyforpetloss.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>
            Academy for Pet Loss
          </a>
          . Counsellors:{' '}
          <a href="/login" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>
            sign in
          </a>
        </p>
      </footer>

    </div>
  )
}
