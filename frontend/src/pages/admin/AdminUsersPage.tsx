import { useEffect, useState } from 'react'
import { getUsers, updateUser, deleteUser } from '@/api/users'
import { register } from '@/api/auth'
import type { User, UserRole } from '@/types'

const ROLES: UserRole[] = ['customer', 'artist', 'admin']
const emptyForm = { username: '', email: '', password: '', role: 'customer' as UserRole }

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('customer')
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getUsers().then(setUsers).finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) return
    setSubmitting(true)
    setError(null)
    try {
      const { user: newUser } = await register({ username: form.username, email: form.email, password: form.password })
      if (form.role !== 'customer') {
        const updated = await updateUser(newUser.id, { role: form.role })
        setUsers(prev => [...prev, updated])
      } else {
        setUsers(prev => [...prev, newUser])
      }
      setForm(emptyForm)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (user: User) => {
    setEditingId(user.id)
    setEditRole(user.role)
  }

  const handleUpdateRole = async (id: string) => {
    const updated = await updateUser(id, { role: editRole })
    setUsers(prev => prev.map(u => u.id === id ? updated : u))
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    await deleteUser(id)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-2">Users</h1>
      <p className="text-[#444] text-xs uppercase tracking-widest mb-10">Manage Accounts</p>

      {/* Create user form */}
      <div className="border border-[#111] p-6 mb-10">
        <p className="text-xs uppercase tracking-widest text-[#444] mb-6">New User</p>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            placeholder="Username *"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="Email *"
            type="email"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Password *"
            type="password"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <select
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest hover:bg-[#b8973b] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-[#111]">
          {users.map(user => (
            <div key={user.id} className="bg-[#0a0a0a] p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[#e5e5e5] text-sm font-medium">{user.username}</p>
                <p className="text-[#444] text-xs mt-1">{user.email}</p>
                <p className="text-[#c9a84c] text-xs uppercase tracking-widest mt-1">{user.role}</p>
              </div>

              {editingId === user.id ? (
                <div className="flex items-center gap-2">
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as UserRole)}
                    className="bg-[#111] border border-[#222] px-3 py-2 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c]"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button
                    onClick={() => handleUpdateRole(user.id)}
                    className="text-xs uppercase tracking-widest px-3 py-2 bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#b8973b] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs uppercase tracking-widest px-3 py-2 border border-[#1a1a1a] text-[#444] hover:border-[#333] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(user)}
                    className="text-xs uppercase tracking-widest px-3 py-1 border border-[#1a1a1a] text-[#444] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                  >
                    Edit Role
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-xs uppercase tracking-widest px-3 py-1 border border-red-900/50 text-red-500 hover:bg-red-900/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage
