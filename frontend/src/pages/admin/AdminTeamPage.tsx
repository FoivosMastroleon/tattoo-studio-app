import { useEffect, useState } from 'react'
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/api/teamMembers'
import ImageUploadInput from '@/components/ImageUploadInput'
import type { TeamMember } from '@/types'

const empty = { name: '', role: '', imageUrl: '', position: '', order: 0 }

const AdminTeamPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTeamMembers().then(setMembers).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.role) return
    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        role: form.role,
        imageUrl: form.imageUrl || undefined,
        position: form.position || undefined,
        order: Number(form.order) || 0,
      }
      if (editing) {
        const updated = await updateTeamMember(editing, payload)
        setMembers(prev => prev.map(m => m.id === editing ? updated : m).sort((a, b) => a.order - b.order))
        setEditing(null)
      } else {
        const created = await createTeamMember(payload)
        setMembers(prev => [...prev, created].sort((a, b) => a.order - b.order))
      }
      setForm(empty)
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (member: TeamMember) => {
    setEditing(member.id)
    setForm({
      name: member.name,
      role: member.role,
      imageUrl: member.imageUrl ?? '',
      position: member.position ?? '',
      order: member.order,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    await deleteTeamMember(id)
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-2">Team</h1>
      <p className="text-[#444] text-xs uppercase tracking-widest mb-10">Manage "Meet the Artists" section</p>

      {/* Form */}
      <div className="border border-[#111] p-6 mb-12">
        <p className="text-xs uppercase tracking-widest text-[#444] mb-6">
          {editing ? 'Edit Team Member' : 'New Team Member'}
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Name *"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            placeholder="Role * (e.g. Tattoo Artist)"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <div className="md:col-span-2">
            <ImageUploadInput
              label="Photo"
              value={form.imageUrl}
              onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
            />
          </div>
          <input
            value={form.position}
            onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
            placeholder='Image position (optional, e.g. "50% 30%")'
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            type="number"
            value={form.order}
            onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
            placeholder="Display order"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest hover:bg-[#b8973b] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editing ? 'Update' : 'Add Member'}
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
          {members.map(member => (
            <div key={member.id} className="bg-[#0a0a0a] p-5 flex items-center gap-4">
              {member.imageUrl && (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                  style={{ objectPosition: member.position || '50% 50%' }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg text-[#e5e5e5]">{member.name}</p>
                <p className="text-[#444] text-xs mt-1 uppercase tracking-widest">{member.role}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(member)}
                  className="text-xs uppercase tracking-widest px-3 py-1 border border-[#1a1a1a] text-[#444] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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

export default AdminTeamPage
