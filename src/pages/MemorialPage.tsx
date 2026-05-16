import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { MemorialPage as MemorialPageType } from '../lib/types'
import MemorialPageView from '../components/MemorialPageView'

export default function MemorialPage() {
  const { slug } = useParams()
  const [page, setPage] = useState<MemorialPageType | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getDocs(query(collection(db, 'memorial-pages'), where('slug', '==', slug), limit(1)))
      .then(snap => {
        if (snap.empty) { setNotFound(true); return }
        setPage({ id: snap.docs[0].id, ...snap.docs[0].data() } as MemorialPageType)
      })
  }, [slug])

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center text-stone-400">
      <p>This memorial page could not be found.</p>
    </div>
  )

  if (!page) return (
    <div className="min-h-screen flex items-center justify-center text-stone-300">
      <p>Loading…</p>
    </div>
  )

  return <MemorialPageView page={page} shareUrl={window.location.href} />
}
