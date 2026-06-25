import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { loginSchema, type LoginFields } from '@/schemas/auth'
import { useAuth } from '@/context/AuthProvider'
import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'

const LoginPage = () => {
  const { loginUser, googleLoginUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFields) => {
    setError(null)
    try {
      await loginUser(data)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    }
  }

  const handleGoogleSuccess = async (credential: string) => {
    setError(null)
    try {
      await googleLoginUser(credential)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in failed')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl text-center mb-2">Welcome Back</h1>
        <p className="text-[#555] text-center text-xs uppercase tracking-widest mb-10">Sign in to your account</p>

        {error && <p className="text-red-400 text-sm text-center mb-6">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#222]" />
          <span className="text-xs text-[#444] uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-[#222]" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) => {
              if (res.credential) handleGoogleSuccess(res.credential)
            }}
            onError={() => setError('Google sign in failed')}
            theme="filled_black"
            size="large"
            width="400"
          />
        </div>

        <p className="text-center text-xs text-[#555] mt-8 uppercase tracking-widest">
          No account?{' '}
          <Link to="/register" className="text-[#c9a84c] hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
