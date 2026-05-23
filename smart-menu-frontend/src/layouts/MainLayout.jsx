import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAutoLogout } from '../hooks/useAutoLogout'

import {
  IconLayoutDashboard,
  IconArmchair,
  IconToolsKitchen2,
  IconClipboardList,
  IconReceipt,
  IconUsers,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
  IconQrcode,
  IconMenu2,
  IconX,
} from '@tabler/icons-react'


const navItems = {
  admin: [
    { label: 'dashboard', icon: IconLayoutDashboard, path: '/admin/dashboard' },
    { label: 'tables', icon: IconArmchair, path: '/admin/tables' },
    { label: 'menu', icon: IconToolsKitchen2, path: '/admin/menu' },
    { label: 'staff', icon: IconUsers, path: '/admin/staff' },
    { label: 'qr_code', icon: IconQrcode, path: '/admin/qr' },
  ],
  waiter: [
    { label: 'tables', icon: IconArmchair, path: '/waiter/tables' },
    { label: 'orders', icon: IconClipboardList, path: '/waiter/orders' },
  ],
  kitchen: [
    { label: 'orders', icon: IconClipboardList, path: '/kitchen/orders' },
  ],
  cashier: [
    { label: 'orders', icon: IconClipboardList, path: '/cashier/orders' },
    { label: 'invoices', icon: IconReceipt, path: '/cashier/invoices' },
  ],
}

function MainLayout({ children }) {
  useAutoLogout()
  const role = localStorage.getItem('role')
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const isAr = i18n.language === 'ar'

  const toggleLang = () => {
    const next = isAr ? 'en' : 'ar'
    i18n.changeLanguage(next)
    document.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    toast.success(isAr ? 'تم تسجيل الخروج' : 'Logged out')
    navigate('/')
  }

  const items = navItems[role] || []
  const CollapseIcon = isAr
    ? (collapsed ? IconChevronLeft : IconChevronRight)
    : (collapsed ? IconChevronRight : IconChevronLeft)

  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 ${isAr ? 'right-0' : 'left-0'} z-50
        ${collapsed ? 'w-16' : 'w-56'} 
        ${isMobileOpen ? 'translate-x-0' : (isAr ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}
        bg-[#1E1410] flex flex-col transition-all duration-300 flex-shrink-0
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-[#2E2420] h-16">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="RestoHub Logo" className="h-8 w-auto object-contain bg-white rounded-full p-1" />
              <span className="text-white font-semibold text-sm">RestoHub</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex text-[#F0E8E0] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <CollapseIcon size={16} />
          </button>
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-[#F0E8E0] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <IconX size={20} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-[#D95F2B]/20 text-[#D95F2B] border-s-2 border-[#D95F2B]'
                  : 'text-[#F0E8E0] hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{t(item.label)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-[#2E2420] flex flex-col gap-2">

          {/* اللغة */}
          <div className={`flex ${collapsed ? 'justify-center' : 'gap-2 px-1'}`}>
            {!collapsed && (
              <>
                <button
                  onClick={() => { i18n.changeLanguage('ar'); document.dir = 'rtl' }}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors
                    ${isAr ? 'bg-[#D95F2B] text-white' : 'text-[#F0E8E0] hover:bg-white/10'}`}
                >
                  AR
                </button>
                <button
                  onClick={() => { i18n.changeLanguage('en'); document.dir = 'ltr' }}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors
                    ${!isAr ? 'bg-[#D95F2B] text-white' : 'text-[#F0E8E0] hover:bg-white/10'}`}
                >
                  EN
                </button>
              </>
            )}
          </div>

          {/* User Info */}
          {!collapsed && (
            <div className="px-2 py-2 rounded-lg bg-white/5">
              <p className="text-white text-xs font-medium">
                {localStorage.getItem('name') || 'User'}
              </p>
              <p className="text-[#D95F2B] text-xs capitalize mt-0.5">{role}</p>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#F0E8E0] hover:bg-red-500/20 hover:text-red-400 transition-colors w-full"
          >
            <IconLogout size={18} className="flex-shrink-0" />
            {!collapsed && <span>{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-[#E5E3DE] px-4 md:px-6 py-3.5 flex items-center justify-between flex-shrink-0 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-[#111110] hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
            >
              <IconMenu2 size={20} />
            </button>
            <h1 className="text-[#111110] font-semibold text-base">
              {t(items.find(i => i.path === window.location.pathname)?.label || 'dashboard')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8A8785] capitalize bg-[#FBF0EB] text-[#D95F2B] px-3 py-1 rounded-full font-medium">
              {role}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout