import React, { useState } from 'react'
import { Crown, Zap, Loader2, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Billing: React.FC = () => {
  const [plan, setPlan] = useState<'basic' | 'pro' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!plan) return

    setLoading(true)
    setError(null)

    try {
      // 1️⃣ Pega a sessão (token)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Usuário não autenticado')
      }

      // 2️⃣ Chama a Edge Function COM Authorization
      const { data, error } = await supabase.functions.invoke(
        'mercado-pago-checkout',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: {
            plan,
          },
        }
      )

      if (error) throw error
      if (!data?.url) throw new Error('Checkout não gerado')

      // 3️⃣ Redireciona
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      {/* Header */}
      <div className="sticky top-[88px] bg-brand-bg/80 backdrop-blur-md z-20 py-2">
        <h3 className="text-2xl font-black text-brand-dark tracking-tight">
          Plano & Pagamento
        </h3>
        <p className="text-sm text-brand-muted">
          Escolha o plano ideal para o seu negócio
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Planos */}
      <div className="grid gap-4">
        <button
          onClick={() => setPlan('basic')}
          className={`p-6 bg-white rounded-[2rem] border-2 transition-all text-left flex items-center gap-4
          ${plan === 'basic'
            ? 'border-brand-primary ring-4 ring-brand-primary/10'
            : 'border-gray-100 hover:border-brand-primary/30'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-dark flex items-center justify-center">
            <Zap />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-brand-dark text-xl">Basic</h4>
            <p className="text-sm text-brand-muted">Ideal para começar</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">R$ 39</span>
            <span className="text-sm font-bold text-brand-muted">/mês</span>
          </div>
          {plan === 'basic' && <Check />}
        </button>

        <button
          onClick={() => setPlan('pro')}
          className={`p-6 bg-white rounded-[2rem] border-2 transition-all text-left flex items-center gap-4
          ${plan === 'pro'
            ? 'border-brand-dark ring-4 ring-brand-dark/10'
            : 'border-gray-100 hover:border-brand-primary/30'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center">
            <Crown />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-brand-dark text-xl">Pro</h4>
            <p className="text-sm text-brand-muted">Acesso total + IA</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">R$ 89</span>
            <span className="text-sm font-bold text-brand-muted">/mês</span>
          </div>
          {plan === 'pro' && <Check />}
        </button>
      </div>

      <button
        onClick={handleCheckout}
        disabled={!plan || loading}
        className="w-full py-4 bg-brand-primary text-brand-dark rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Ir para pagamento'}
      </button>
    </div>
  )
}

export default Billing
