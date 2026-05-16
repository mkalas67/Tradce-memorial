import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../lib/auth-context'
import type { MemorialPage, Species, FontChoice, Palette } from '../lib/types'
import MemorialPageView from '../components/MemorialPageView'
import ImageUpload from '../components/ImageUpload'
import GalleryUpload from '../components/GalleryUpload'
import StickerPicker from '../components/StickerPicker'

const SPECIES_DEFAULTS: Record<Species, { font: FontChoice; palette: Palette }> = {
  dog:   { font: 'friendly',  palette: 'golden' },
  cat:   { font: 'personal',  palette: 'lavender' },
  horse: { font: 'classic',   palette: 'forest' },
  bird:  { font: 'modern',    palette: 'sky' },
  other: { font: 'classic',   palette: 'rose' },
}

function makeSlug(petName: string, dateTo: string) {
  const name = petName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const year = dateTo.replace(/[^0-9]/g, '').slice(0, 4)
  return year ? `${name}-${year}` : name
}

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  )
}

function PanelCard({ children }: { children: React.ReactNode }) {
  return <div className="border border-stone-100 rounded-xl p-4 bg-white space-y-3">{children}</div>
}

export default function BuilderEditor() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState<Partial<MemorialPage>>({
    species: 'dog',
    font: 'friendly',
    palette: 'golden',
    panel1Name: 'Who I Was',
    panel2Name: 'Our Bond',
    panel3Name: 'We Miss You',
    panel4Name: 'My Favourite Things',
    panel5Name: 'My Legacy',
    panel6Name: 'Photo Gallery',
    favouriteThings: {},
    galleryPhotos: [],
    stickers: [],
  })

  useEffect(() => {
    if (!isNew && id) {
      getDoc(doc(db, 'memorial-pages', id)).then(snap => {
        if (snap.exists()) setPage({ id: snap.id, ...snap.data() } as MemorialPage)
      })
    }
  }, [id, isNew])

  function update(fields: Partial<MemorialPage>) {
    setPage(prev => ({ ...prev, ...fields }))
  }

  function handleSpeciesChange(species: Species) {
    update({ species, ...SPECIES_DEFAULTS[species] })
  }

  async function handleSave() {
    if (!user || !page.petName) return
    setSaving(true)
    const now = Date.now()
    const docId = isNew ? crypto.randomUUID() : id!
    const slug = makeSlug(page.petName!, page.dateTo || '')

    const data: Omit<MemorialPage, 'id'> = {
      slug,
      createdBy: user.uid,
      createdAt: isNew ? now : (page.createdAt ?? now),
      editableUntil: isNew ? now + SIX_MONTHS_MS : (page.editableUntil ?? now + SIX_MONTHS_MS),
      editable: true,
      petName: page.petName ?? '',
      heroPhotoUrl: page.heroPhotoUrl ?? '',
      dateFrom: page.dateFrom ?? '',
      dateTo: page.dateTo ?? '',
      tagline: page.tagline ?? '',
      species: page.species ?? 'dog',
      font: page.font ?? 'friendly',
      palette: page.palette ?? 'golden',
      panel1Name: page.panel1Name ?? 'Who I Was',
      panel1Content: page.panel1Content ?? '',
      panel2Name: page.panel2Name ?? 'Our Bond',
      panel2Content: page.panel2Content ?? '',
      panel3Name: page.panel3Name ?? 'We Miss You',
      panel3Content: page.panel3Content ?? '',
      panel4Name: page.panel4Name ?? 'My Favourite Things',
      favouriteThings: page.favouriteThings ?? {},
      panel5Name: page.panel5Name ?? 'My Legacy',
      panel5Content: page.panel5Content ?? '',
      panel6Name: page.panel6Name ?? 'Photo Gallery',
      galleryPhotos: page.galleryPhotos ?? [],
      stickers: page.stickers ?? [],
      counsellorName: page.counsellorName ?? '',
      counsellorId: user.uid,
    }

    await setDoc(doc(db, 'memorial-pages', docId), data)
    setSaving(false)
    if (isNew) navigate(`/builder/${docId}`)
  }

  const field = (label: string, key: keyof MemorialPage, placeholder?: string) => (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1">{label}</label>
      <input
        type="text"
        value={(page[key] as string) ?? ''}
        placeholder={placeholder}
        onChange={e => update({ [key]: e.target.value })}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 placeholder:text-stone-300"
      />
    </div>
  )

  const textarea = (label: string, key: keyof MemorialPage, placeholder: string) => (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1">{label}</label>
      <textarea
        rows={6}
        value={(page[key] as string) ?? ''}
        placeholder={placeholder}
        onChange={e => update({ [key]: e.target.value })}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none placeholder:text-stone-300"
      />
    </div>
  )

  const storagePath = `memorials/${user?.uid ?? 'unknown'}`

  return (
    <div className="h-screen flex flex-col bg-stone-50">

      <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <button onClick={() => navigate('/builder')} className="text-sm text-stone-400 hover:text-stone-600">← My pages</button>
        <span className="font-semibold text-stone-800 text-sm">{page.petName || 'New memorial'}</span>
        <button
          onClick={handleSave}
          disabled={saving || !page.petName}
          className="bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-40 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Left — editor */}
        <div className="w-1/2 overflow-y-auto px-6 py-8 space-y-10 border-r border-stone-100">

          <Section title="Species">
            <div className="flex gap-2 flex-wrap">
              {(['dog', 'cat', 'horse', 'bird', 'other'] as Species[]).map(s => (
                <button key={s} onClick={() => handleSpeciesChange(s)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${page.species === s ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400">Sets default colours and font — you can change both below.</p>
          </Section>

          <Section title="Pet details">
            {field("Pet's name", 'petName', 'e.g. Bella')}
            {field('Tagline', 'tagline', 'e.g. Beloved golden retriever and faithful companion')}
            {field('Year or date from', 'dateFrom', 'e.g. 2010')}
            {field('Year or date to', 'dateTo', 'e.g. 2024 — or leave blank for "Forever in our hearts"')}
            {field('Your name', 'counsellorName', 'Shown as the counsellor credit at the bottom')}
          </Section>

          <Section title="Hero photo">
            <ImageUpload
              value={page.heroPhotoUrl}
              onChange={url => update({ heroPhotoUrl: url })}
              path={storagePath}
              label="Best photo — shown full width at the top"
              hint="Landscape works best"
              aspectRatio="wide"
            />
          </Section>

          <Section title="Panels">
            <p className="text-xs text-stone-400 -mt-2">You can rename each panel heading. The text will appear when visitors tap to expand.</p>

            <PanelCard>
              {field('Panel heading', 'panel1Name')}
              {textarea('Their story', 'panel1Content',
                'Write about who they were — their species and breed, how they came into the family, their personality, their quirks. What made them uniquely themselves? (200–300 words)'
              )}
            </PanelCard>

            <PanelCard>
              {field('Panel heading', 'panel2Name')}
              {textarea('The bond you shared', 'panel2Content',
                'Describe the relationship — what made it special, who they were closest to, how they fitted into family life. What did they mean to the people who loved them? (150–200 words)'
              )}
            </PanelCard>

            <PanelCard>
              {field('Panel heading', 'panel3Name')}
              {textarea('What you miss most', 'panel3Content',
                'What does the house feel like without them? Describe the small daily moments — the sounds, routines, and little things that are most missed now they are gone. (around 150 words)'
              )}
            </PanelCard>

            <PanelCard>
              {field('Panel heading', 'panel4Name')}
              <p className="text-xs text-stone-400">Fill in as many as apply — each becomes a line on the page.</p>
              {(['food', 'place', 'toy', 'person', 'activity'] as const).map(k => (
                <div key={k}>
                  <label className="block text-xs font-medium text-stone-500 mb-1 capitalize">{k}</label>
                  <input
                    type="text"
                    value={page.favouriteThings?.[k] ?? ''}
                    placeholder={{
                      food: 'e.g. Peanut butter, chicken treats',
                      place: 'e.g. The back garden, the park on the hill',
                      toy: 'e.g. Their squeaky duck',
                      person: 'e.g. Grandma, the children',
                      activity: 'e.g. Morning walks, chasing squirrels',
                    }[k]}
                    onChange={e => update({ favouriteThings: { ...page.favouriteThings, [k]: e.target.value } })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 placeholder:text-stone-300"
                  />
                </div>
              ))}
            </PanelCard>

            <PanelCard>
              {field('Panel heading', 'panel5Name')}
              {textarea('Their lasting legacy', 'panel5Content',
                'What do they leave behind? How did they change the people around them? Describe the continuing bond — the memories, habits, or ways of seeing the world that live on because of them. (around 150 words)'
              )}
            </PanelCard>
          </Section>

          <Section title="Photo gallery">
            <p className="text-xs text-stone-400 -mt-2">Add up to 20 photos. These appear in the collapsible gallery panel.</p>
            {field('Gallery panel heading', 'panel6Name')}
            <GalleryUpload
              photos={page.galleryPhotos ?? []}
              onChange={photos => update({ galleryPhotos: photos })}
              storagePath={storagePath}
            />
          </Section>

          <Section title="Stickers">
            <p className="text-xs text-stone-400 -mt-2">Add decorative stickers to the hero photo area.</p>
            <StickerPicker
              species={page.species ?? 'dog'}
              palette={page.palette ?? 'golden'}
              stickers={page.stickers ?? []}
              onChange={stickers => update({ stickers })}
            />
          </Section>

          <Section title="Personalisation">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-2">Font</label>
              <div className="flex gap-2 flex-wrap">
                {([
                  { id: 'classic',  label: 'Classic',  desc: 'Serif — timeless' },
                  { id: 'modern',   label: 'Modern',   desc: 'Clean sans-serif' },
                  { id: 'personal', label: 'Personal', desc: 'Warm script feel' },
                  { id: 'friendly', label: 'Friendly', desc: 'Rounded, approachable' },
                ] as { id: FontChoice; label: string; desc: string }[]).map(f => (
                  <button key={f.id} onClick={() => update({ font: f.id })}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${page.font === f.id ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}
                    title={f.desc}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-2">Colour palette</label>
              <div className="flex gap-2 flex-wrap">
                {([
                  { id: 'meadow', color: '#4a7c59' },
                  { id: 'ocean', color: '#2a6496' },
                  { id: 'sunset', color: '#c0673b' },
                  { id: 'forest', color: '#3a5f3a' },
                  { id: 'lavender', color: '#7c5c9e' },
                  { id: 'monochrome', color: '#2c2c2c' },
                  { id: 'golden', color: '#b8860b' },
                  { id: 'rose', color: '#b5507a' },
                  { id: 'sky', color: '#3a7bbf' },
                ] as { id: Palette; color: string }[]).map(p => (
                  <button key={p.id} onClick={() => update({ palette: p.id })}
                    title={p.id.charAt(0).toUpperCase() + p.id.slice(1)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${page.palette === p.id ? 'border-stone-800 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ background: p.color }}
                  />
                ))}
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {page.palette ? page.palette.charAt(0).toUpperCase() + page.palette.slice(1) : ''}
              </p>
            </div>
          </Section>

        </div>

        {/* Right — live preview */}
        <div className="w-1/2 overflow-y-auto bg-stone-100 flex flex-col items-center py-8 px-6">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-4">Live preview</p>
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-stone-200">
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
              <MemorialPageView page={page} shareUrl="trace.memorial/preview" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
