import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      navigate('/admin/dashboard')
    } catch (error) {
      setError(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-etf-blue mb-6 text-center">
            Administration FRONTS ETF
          </h1>

          {error && (
            <div className="flex gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@etf.fr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Accès réservé aux administrateurs
          </p>
        </div>
      </div>
    </div>
  )
}
