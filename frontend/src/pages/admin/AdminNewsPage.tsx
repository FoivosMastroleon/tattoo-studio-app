import { useEffect, useState } from 'react'
import { getPosts, createPost, updatePost, deletePost } from '@/api/posts'
import type { Post } from '@/types'

const empty = { title: '', content: '', imageUrl: '' }

const AdminNewsPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getPosts().then(setPosts).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) return
    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl || undefined,
      }
      if (editing) {
        const updated = await updatePost(editing, payload)
        setPosts(prev => prev.map(p => p.id === editing ? updated : p))
        setEditing(null)
      } else {
        const created = await createPost(payload)
        setPosts(prev => [created, ...prev])
      }
      setForm(empty)
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (post: Post) => {
    setEditing(post.id)
    setForm({ title: post.title, content: post.content, imageUrl: post.imageUrl ?? '' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await deletePost(id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-2">News</h1>
      <p className="text-[#444] text-xs uppercase tracking-widest mb-10">Manage Posts</p>

      {/* Form */}
      <div className="border border-[#111] p-6 mb-12">
        <p className="text-xs uppercase tracking-widest text-[#444] mb-6">
          {editing ? 'Edit Post' : 'New Post'}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title *"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            value={form.imageUrl}
            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            placeholder="Image URL (optional)"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            rows={6}
            placeholder="Content *"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest hover:bg-[#b8973b] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editing ? 'Update' : 'Publish'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setForm(empty) }}
                className="px-6 py-3 border border-[#1a1a1a] text-[#444] text-xs uppercase tracking-widest hover:border-[#333] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-[#111]">
          {posts.map(post => (
            <div key={post.id} className="bg-[#0a0a0a] p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[#e5e5e5] text-sm font-medium truncate">{post.title}</p>
                <p className="text-[#333] text-xs uppercase tracking-widest mt-1">
                  {new Date(post.createdAt).toLocaleDateString('en-GB')}
                </p>
                <p className="text-[#444] text-xs mt-2 line-clamp-2">{post.content}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(post)}
                  className="text-xs uppercase tracking-widest px-3 py-1 border border-[#1a1a1a] text-[#444] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs uppercase tracking-widest px-3 py-1 border border-red-900/50 text-red-500 hover:bg-red-900/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminNewsPage
