import { useState } from 'react'
import { Mail, Link2 } from 'lucide-react'
import type { MemorialPage } from '../lib/types'
import { STICKER_SETS } from '../lib/stickers'

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.057 23.492a.5.5 0 0 0 .614.614l5.637-1.475A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 0 1-5.003-1.374l-.358-.214-3.724.975.993-3.63-.234-.374A9.77 9.77 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

export const PALETTE_VARS: Record<string, string> = {
  meadow:     '--accent: #4a7c59; --bg: #f0f7f0; --panel-bg: #e6f0e6;',
  ocean:      '--accent: #2a6496; --bg: #f0f5fa; --panel-bg: #e0ecf4;',
  sunset:     '--accent: #c0673b; --bg: #fdf5f0; --panel-bg: #fae8dc;',
  forest:     '--accent: #3a5f3a; --bg: #f2f5f0; --panel-bg: #e4ece0;',
  lavender:   '--accent: #7c5c9e; --bg: #f7f0fb; --panel-bg: #ede0f7;',
  monochrome: '--accent: #2c2c2c; --bg: #f5f5f5; --panel-bg: #e8e8e8;',
  golden:     '--accent: #b8860b; --bg: #fdfaf0; --panel-bg: #f7f0d8;',
  rose:       '--accent: #b5507a; --bg: #fdf0f5; --panel-bg: #f7dcea;',
  sky:        '--accent: #3a7bbf; --bg: #f0f7ff; --panel-bg: #ddeeff;',
}

export const FONT_FAMILIES: Record<string, string> = {
  classic:  'Georgia, "Times New Roman", serif',
  modern:   '"Inter", "Helvetica Neue", sans-serif',
  personal: 'Georgia, cursive',
  friendly: '"Trebuchet MS", "Segoe UI", sans-serif',
}

const STICKER_COLORS: Record<string, string> = {
  meadow: '#4a7c59', ocean: '#2a6496', sunset: '#c0673b', forest: '#3a5f3a',
  lavender: '#7c5c9e', monochrome: '#ffffff', golden: '#b8860b', rose: '#b5507a', sky: '#3a7bbf',
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--panel-bg)', borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'var(--panel-bg)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 15 }}>{title}</span>
        <span style={{ color: 'var(--accent)', fontSize: 18, lineHeight: 1, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '16px 20px', color: '#44403c', lineHeight: 1.75, fontSize: 14 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function ShareBar({ petName, shareUrl }: { petName: string; shareUrl: string }) {
  const [copied, setCopied] = useState(false)
  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1877F2', color: 'white', padding: '9px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
        <FacebookIcon /> Share
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent('In memory of ' + petName + ' ' + shareUrl)}`}
        target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#25D366', color: 'white', padding: '9px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
        <WhatsAppIcon /> WhatsApp
      </a>
      <a href={`mailto:?subject=In memory of ${petName}&body=I wanted to share this memorial with you: ${shareUrl}`}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f5f4', color: '#44403c', padding: '9px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
        <Mail size={15} /> Email
      </a>
      <button onClick={copyLink}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f5f4', color: '#44403c', padding: '9px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
        <Link2 size={15} /> {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}

interface Props {
  page: Partial<MemorialPage>
  shareUrl?: string
}

export default function MemorialPageView({ page, shareUrl = window.location.href }: Props) {
  const paletteVars = PALETTE_VARS[page.palette ?? 'golden']
  const fontFamily = FONT_FAMILIES[page.font ?? 'classic']
  const stickerColor = STICKER_COLORS[page.palette ?? 'golden']

  const allStickers = Object.values(STICKER_SETS).flat()

  return (
    <div style={{ fontFamily, minHeight: '100%' }}>
      <style>{`.memorial-root { ${paletteVars} }`}</style>

      <div className="memorial-root" style={{ background: 'var(--bg)', minHeight: '100%' }}>

        {/* Top share bar */}
        <div style={{ background: 'white', borderBottom: '1px solid #f5f5f4', padding: '12px 16px' }}>
          <ShareBar petName={page.petName ?? ''} shareUrl={shareUrl} />
        </div>

        {/* Hero with sticker overlay */}
        <div style={{ position: 'relative', background: '#d6d3d1' }}>
          {page.heroPhotoUrl ? (
            <img src={page.heroPhotoUrl} alt={page.petName} style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a8a29e', fontSize: 13 }}>
              Hero photo will appear here
            </div>
          )}

          {/* Sticker overlay */}
          {page.stickers && page.stickers.length > 0 && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {page.stickers.map((s, i) => {
                const def = allStickers.find(a => a.id === s.stickerId)
                if (!def) return null
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${s.x}%`,
                      top: `${s.y}%`,
                      width: 36,
                      height: 36,
                      color: stickerColor,
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
                      transform: 'translate(-50%, -50%)',
                    }}
                    dangerouslySetInnerHTML={{ __html: def.svg }}
                  />
                )
              })}
            </div>
          )}

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1) 60%, transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 20px 24px' }}>
            <h1 style={{ color: 'white', fontSize: 30, fontWeight: 700, margin: 0, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{page.petName || 'Pet name'}</h1>
            {(page.dateFrom || page.dateTo) && (
              <p style={{ color: 'rgba(255,255,255,0.85)', margin: '4px 0 0', fontSize: 14 }}>{page.dateFrom} — {page.dateTo}</p>
            )}
            {page.tagline && <p style={{ color: 'rgba(255,255,255,0.75)', margin: '4px 0 0', fontSize: 13, fontStyle: 'italic' }}>{page.tagline}</p>}
          </div>
        </div>

        {/* Accordion panels */}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 0' }}>

          {page.panel1Name && (
            <Accordion title={page.panel1Name}>
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{page.panel1Content || <span style={{ color: '#c8c4c0', fontStyle: 'italic' }}>Their story will appear here…</span>}</p>
            </Accordion>
          )}

          {page.panel2Name && (
            <Accordion title={page.panel2Name}>
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{page.panel2Content || <span style={{ color: '#c8c4c0', fontStyle: 'italic' }}>The bond you shared will appear here…</span>}</p>
            </Accordion>
          )}

          {page.panel3Name && (
            <Accordion title={page.panel3Name}>
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{page.panel3Content || <span style={{ color: '#c8c4c0', fontStyle: 'italic' }}>What you miss most will appear here…</span>}</p>
            </Accordion>
          )}

          {page.panel4Name && (
            <Accordion title={page.panel4Name}>
              {page.favouriteThings && Object.entries(page.favouriteThings).filter(([, v]) => v).length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(page.favouriteThings).filter(([, v]) => v).map(([k, v]) => (
                    <li key={k} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'capitalize', minWidth: 80, flexShrink: 0, fontSize: 13 }}>{k}</span>
                      <span style={{ fontSize: 14 }}>{v}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{ color: '#c8c4c0', fontStyle: 'italic', fontSize: 14 }}>Their favourite things will appear here…</span>
              )}
            </Accordion>
          )}

          {page.panel5Name && (
            <Accordion title={page.panel5Name}>
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{page.panel5Content || <span style={{ color: '#c8c4c0', fontStyle: 'italic' }}>Their lasting legacy will appear here…</span>}</p>
            </Accordion>
          )}

          {page.panel6Name && (
            <Accordion title={page.panel6Name}>
              {page.galleryPhotos && page.galleryPhotos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {page.galleryPhotos.map((photo, i) => (
                    <div key={i}>
                      <img src={photo.url} alt={photo.caption ?? ''} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }} />
                      {photo.caption && <p style={{ fontSize: 11, color: '#78716c', margin: '4px 0 0' }}>{photo.caption}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ color: '#c8c4c0', fontStyle: 'italic', fontSize: 14 }}>Photo gallery will appear here…</span>
              )}
            </Accordion>
          )}
        </div>

        {/* Certificate + bottom share */}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <button style={{ border: '1px solid var(--accent)', color: 'var(--accent)', background: 'transparent', padding: '10px 28px', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
              Download memorial certificate
            </button>
          </div>

          <div style={{ paddingTop: 20, borderTop: '1px solid #e7e5e4' }}>
            <ShareBar petName={page.petName ?? ''} shareUrl={shareUrl} />
          </div>

          {page.counsellorName && (
            <p style={{ textAlign: 'center', fontSize: 11, color: '#c8c4c0', marginTop: 20 }}>
              Memorial created by {page.counsellorName} · Academy for Pet Loss
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
