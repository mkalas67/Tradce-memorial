import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { db, auth } from '../lib/firebase'
import { useAuth } from '../lib/auth-context'
import type { MemorialPage } from '../lib/types'

export default function BuilderDashboard() {
  const { user } = useAuth()
  const [pages, setPages] = useState<MemorialPage[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    getDocs(
      query(
        collection(db, 'memorial-pages'),
        where('createdBy', '==', user.uid),
        orderBy('createdAt', 'desc'),
      )
    ).then(snap => {
      setPages(snap.docs.map(d => ({ id: d.id, ...d.data() } as MemorialPage)))
      setLoading(false)
    })
  }, [user])

  async function handleSignOut() {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-stone-800">trace.memorial</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-500">{user?.email}</span>
          <button onClick={handleSignOut} className="text-sm text-stone-400 hover:text-stone-600">Sign out</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-stone-800">My memorial pages</h1>
          <Link
            to="/builder/new"
            className="bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
          >
            + New page
          </Link>
        </div>

        {loading && <p className="text-stone-400 text-sm">Loading…</p>}

        {!loading && pages.length === 0 && (
          <div className="text-center py-24 text-stone-400">
            <p className="mb-4">No memorial pages yet.</p>
            <Link to="/builder/new" className="text-stone-600 underline text-sm">Create your first one</Link>
          </div>
        )}

        <ul className="space-y-3">
          {pages.map(page => (
            <li key={page.id}>
              <Link
                to={`/builder/${page.id}`}
                className="flex items-center justify-between bg-white rounded-xl border border-stone-100 px-5 py-4 hover:border-stone-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-stone-800">{page.petName}</p>
                  <p className="text-sm text-stone-400 mt-0.5">
                    trace.memorial/{page.slug}
                    {!page.editable && <span className="ml-2 text-amber-500">· locked</span>}
                  </p>
                </div>
                <span className="text-stone-300 text-sm">Edit →</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
