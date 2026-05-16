import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../lib/firebase'
import { useAuth } from '../lib/auth-context'

interface Props {
  value?: string
  onChange: (url: string) => void
  path: string        // storage path prefix e.g. "memorials/userId"
  label: string
  hint?: string
  aspectRatio?: 'wide' | 'square'
}

export default function ImageUpload({ value, onChange, path, label, hint, aspectRatio = 'wide' }: Props) {
  const { user } = useAuth()
  const [progress, setProgress] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    if (!user) return
    const ext = file.name.split('.').pop()
    const storageRef = ref(storage, `${path}/${Date.now()}.${ext}`)
    const task = uploadBytesResumable(storageRef, file)

    task.on('state_changed',
      snap => setProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      err => { console.error(err); setProgress(null) },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        onChange(url)
        setProgress(null)
      }
    )
  }

  function handleFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    upload(file)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0])
  }

  const height = aspectRatio === 'wide' ? 140 : 100

  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1">
        {label}{hint && <span className="text-stone-400 font-normal ml-1">{hint}</span>}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{ height }}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${dragging ? 'border-stone-400 bg-stone-100' : 'border-stone-200 bg-stone-50 hover:border-stone-300'}`}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Click to replace</span>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-1 text-stone-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="text-xs">{progress !== null ? `Uploading ${progress}%` : 'Click or drag a photo here'}</span>
          </div>
        )}

        {progress !== null && (
          <div className="absolute bottom-0 left-0 h-1 bg-stone-800 transition-all" style={{ width: `${progress}%` }} />
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}
