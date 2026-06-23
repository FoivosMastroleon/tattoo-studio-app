import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { registerSchema, type RegisterFields } from '@/schemas/auth'
import { useAuth } from '@/context/AuthProvider'
import { useState } from 'react'

const RegisterPage = () => {
  const { registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFields) => {
    setError(null)
    try {
      await registerUser(data)
      navigate('/')
    } catch {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl text-center mb-2">Create Account</h1>
        <p className="text-[#555] text-center text-xs uppercase tracking-widest mb-10">Join our studio</p>

        {error && <p className="text-red-400 text-sm text-center mb-6">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Username</label>
            <input
              {...register('username')}
              type="text"
              placeholder="yourname"
              className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest font-medium hover:bg-[#b8973b] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#555] mt-8 uppercase tracking-widest">
          Already have an account?{' '}
          <Link to="/login" className="text-[#c9a84c] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
