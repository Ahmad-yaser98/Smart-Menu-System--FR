import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconEye, IconEyeOff, IconToolsKitchen2 } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import { login } from '../services/authService'

function Login() {
  const { t, i18n } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const isAr = i18n.language === 'ar'

  const toggleLang = () => {
    const next = isAr ? 'en' : 'ar'
    i18n.changeLanguage(next)
    document.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('name', data.user.name)
      localStorage.setItem('user_id', data.user.id)
      toast.success(isAr ? 'تم تسجيل الدخول!' : 'Logged in successfully!')
      const roleHome = {
     admin: '/admin/dashboard',
     waiter: '/waiter/tables',
      kitchen: '/kitchen/orders',
      cashier: '/cashier/orders',
       }
navigate(roleHome[data.user.role] || '/')
    } catch {
      toast.error(isAr ? 'البريد أو كلمة المرور غلط!' : 'Invalid credentials!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* الجانب الأيسر - الهوية */}
      <div className="hidden lg:flex w-1/2 bg-[#1E1410] flex-col items-center justify-center gap-6">
        <img src="/logo.png" alt="RestoHub Logo" className="w-64 h-auto object-contain bg-white rounded-full p-3" />
        <p className="text-[#F0E8E0] text-sm opacity-70">
          {isAr ? 'نظام إدارة المطعم الذكي' : 'Intelligent Restaurant Management'}
        </p>
      </div>

      {/* الجانب الأيمن - الفورم */}
      <div className="w-full lg:w-1/2 bg-[#F8F7F4] flex items-center justify-center p-8">
        <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-sm border border-[#E5E3DE]">

          {/* زر اللغة */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleLang}
              className="text-sm px-4 py-1.5 rounded-full border border-[#E5E3DE] text-[#4A4845] hover:border-[#D95F2B] hover:text-[#D95F2B] transition-colors"
            >
              {isAr ? 'EN' : 'AR'}
            </button>
          </div>

          {/* العنوان */}
          <h2 className="text-[#111110] text-2xl font-semibold mb-1">
            {t('welcome_back')}
          </h2>
          <p className="text-[#8A8785] text-sm mb-8">
            {isAr ? 'سجّل دخولك للمتابعة' : 'Sign in to your account to continue'}
          </p>

          {/* الفورم */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* الإيميل */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#4A4845]">
                {t('email')}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] bg-white text-[#111110] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20 transition-all"
              />
            </div>

            {/* كلمة المرور */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#4A4845]">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter your password'}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] bg-white text-[#111110] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-[#8A8785] hover:text-[#4A4845]"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* تذكرني */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-[#D95F2B]" />
              <label htmlFor="remember" className="text-sm text-[#4A4845]">
                {t('remember_me')}
              </label>
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D95F2B] hover:bg-[#C04E1F] disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors mt-2"
            >
              {loading
                ? (isAr ? 'جاري الدخول...' : 'Signing in...')
                : t('sign_in')
              }
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login