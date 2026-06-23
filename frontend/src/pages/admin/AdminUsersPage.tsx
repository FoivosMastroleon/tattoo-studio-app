import { useEffect, useState } from 'react'
import { getUsers, updateUser, deleteUser } from '@/api/users'
import type { User, UserRole } from '@/types'

const ROLES: UserRole[] = ['customer', 'artist', 'admin']

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('customer')

  useEffect(() => {
    getUsers().then(setUsers).finally(() => setLoading(false))
  }, [])

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
