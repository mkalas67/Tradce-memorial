import { useState, useRef, type ChangeEvent } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../lib/firebase'
import { useAuth } from '../lib/auth-context'
import type { GalleryPhoto } from '../lib/types'

interface Props {
  photos: GalleryPhoto[]
  onChange: (photos: GalleryPhoto[]) => void
  storagePath: string
}

export default function GalleryUpload({ photos, onChange, storagePath }: Props) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(files: FileList) {
    if (!user) return
    setUploading(true)
    const remaining = 20 - photos.length
    const toUpload = Array.from(files).slice(0, remaining)

    const results = await Promise.all(toUpload.map(async file => {
      const storageRef = ref(storage, `${storagePath}/${Date.now()}-${file.name}`)
      await uploadBytesResumable(storageRef, file)
      const url = await getDownloadURL(storageRef)
      return { url } as GalleryPhoto
    }))

    onChange([...photos, ...results])
    setUploading(false)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) upload(e.target.files)
  }

  function updateCaption(i: number, caption: string) {
    const updated = photos.map((p, idx) => idx === i ? { ...p, caption } : p)
    onChange(updated)
  }

  function remove(i: number) {
    onChange(photos.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <div key={i} className="space-y-1">
            <div className="relative group">
              <img src={photo.url} alt="" className="w-full h-20 object-cover rounded-lg" />
              <button
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >×</button>
            </div>
            <input
              type="text"
              placeholder="Caption (optional)"
              value={photo.caption ?? ''}
              onChange={e => updateCaption(i, e.target.value)}
              className="w-full text-xs border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
        ))}

        {photos.length < 20 && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-20 rounded-lg border-2 border-dashed border-stone-200 text-stone-400 text-xs flex flex-col items-center justify-center gap-1 hover:border-stone-300 transition-colors disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {uploading ? 'Uploading…' : 'Add photos'}
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400">{photos.length} of 20 photos · Click a photo to remove</p>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
    </div>
  )
}
