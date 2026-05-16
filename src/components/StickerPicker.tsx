import type { Species } from '../lib/types'
import type { StickerPlacement } from '../lib/types'
import { getStickers } from '../lib/stickers'

const PALETTE_ACCENT: Record<string, string> = {
  meadow: '#4a7c59', ocean: '#2a6496', sunset: '#c0673b', forest: '#3a5f3a',
  lavender: '#7c5c9e', monochrome: '#2c2c2c', golden: '#b8860b', rose: '#b5507a', sky: '#3a7bbf',
}

interface Props {
  species: Species
  palette: string
  stickers: StickerPlacement[]
  onChange: (stickers: StickerPlacement[]) => void
}

export default function StickerPicker({ species, palette, stickers, onChange }: Props) {
  const available = getStickers(species)
  const accent = PALETTE_ACCENT[palette] ?? '#b8860b'

  function addSticker(id: string) {
    if (stickers.length >= 10) return
    onChange([...stickers, { stickerId: id, x: 10 + Math.random() * 60, y: 10 + Math.random() * 30 }])
  }

  function remove(i: number) {
    onChange(stickers.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {available.map(s => (
          <button
            key={s.id}
            onClick={() => addSticker(s.id)}
            title={s.label}
            className="w-10 h-10 rounded-lg border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 transition-colors flex items-center justify-center p-2"
            style={{ color: accent }}
            dangerouslySetInnerHTML={{ __html: s.svg }}
          />
        ))}
      </div>

      {stickers.length > 0 && (
        <div>
          <p className="text-xs text-stone-400 mb-2">Placed stickers — click × to remove</p>
          <div className="flex flex-wrap gap-2">
            {stickers.map((s, i) => {
              const def = available.find(a => a.id === s.stickerId)
              return (
                <div key={i} className="flex items-center gap-1 bg-stone-100 rounded-full px-2 py-1">
                  <span
                    className="w-4 h-4 inline-block"
                    style={{ color: accent }}
                    dangerouslySetInnerHTML={{ __html: def?.svg ?? '' }}
                  />
                  <span className="text-xs text-stone-600">{def?.label}</span>
                  <button onClick={() => remove(i)} className="text-stone-400 hover:text-stone-600 text-xs ml-1">×</button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-stone-400">Stickers appear scattered in the hero area on the published page. Up to 10.</p>
    </div>
  )
}
