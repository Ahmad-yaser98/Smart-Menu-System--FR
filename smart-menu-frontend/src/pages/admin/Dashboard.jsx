import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconClipboardList,
  IconCurrencyDollar,
  IconArmchair,
  IconToolsKitchen2,
  IconTrendingUp,
  IconTrendingDown,
  IconClock,
} from '@tabler/icons-react'
import API from '../../services/authService'

function StatCard({ icon: Icon, label, value, trend, color }) {
  const isUp = trend >= 0
  return (
    <div className="bg-white rounded-xl border border-[#E5E3DE] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8A8785] uppercase tracking-wide">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-semibold text-[#111110]">{value}</p>
      <div className="flex items-center gap-1">
        {isUp ? <IconTrendingUp size={14} className="text-green-600" /> : <IconTrendingDown size={14} className="text-red-500" />}
        <span className={`text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
          {Math.abs(trend)}%
        </span>
        <span className="text-xs text-[#8A8785]">{window.localStorage.getItem('i18nextLng') === 'ar' || document.dir === 'rtl' ? 'مقارنة بالأمس' : 'vs yesterday'}</span>
      </div>
    </div>
  )
}

const statusColors = {
  pending:     { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'قيد الانتظار' },
  preparing:   { bg: 'bg-[#FBF0EB]', text: 'text-[#D95F2B]',  label: 'قيد التحضير' },
  ready:       { bg: 'bg-green-50',  text: 'text-green-700',  label: 'جاهز' },
  served:      { bg: 'bg-purple-50', text: 'text-purple-700', label: 'تم التقديم' },
  completed:   { bg: 'bg-gray-100',  text: 'text-gray-600',   label: 'مكتمل' },
  cancelled:   { bg: 'bg-red-50',    text: 'text-red-600',    label: 'ملغي' },
}

function StatusBadge({ status }) {
  const s = statusColors[status] || statusColors.pending
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E5E3DE] p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-3 bg-[#EDEBE6] rounded w-24"></div>
        <div className="w-9 h-9 bg-[#EDEBE6] rounded-lg"></div>
      </div>
      <div className="h-8 bg-[#EDEBE6] rounded w-20 mb-3"></div>
      <div className="h-3 bg-[#EDEBE6] rounded w-32"></div>
    </div>
  )
}

function Dashboard() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await API.get('/orders/admin-active', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrders(res.data.data || res.data || [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const stats = [
    { icon: IconClipboardList, label: isAr ? 'طلبات اليوم' : "Today's Orders",   value: orders.length, trend: 12,  color: 'bg-[#D95F2B]' },
    { icon: IconCurrencyDollar, label: isAr ? 'الإيرادات' : 'Revenue',            value: '$' + orders.reduce((s, o) => s + Number(o.total_amount || 0), 0).toFixed(0), trend: 8, color: 'bg-green-600' },
    { icon: IconArmchair,       label: isAr ? 'الطاولات النشطة' : 'Active Tables', value: new Set(orders.map(o => o.table_id)).size, trend: -3, color: 'bg-blue-600' },
    { icon: IconToolsKitchen2,  label: isAr ? 'قيد التحضير' : 'Preparing',        value: orders.filter(o => o.status === 'preparing').length, trend: 5, color: 'bg-purple-600' },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((s, i) => <StatCard key={i} {...s} />)
        }
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E5E3DE] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E3DE]">
          <h2 className="font-semibold text-[#111110] text-sm">
            {isAr ? 'الطلبات النشطة' : 'Active Orders'}
          </h2>
          <span className="text-xs text-[#D95F2B] font-medium bg-[#FBF0EB] px-2.5 py-1 rounded-full">
            {orders.length} {isAr ? 'طلب' : 'orders'}
          </span>
        </div>

        {loading ? (
          <div className="p-5 flex flex-col gap-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-[#EDEBE6] rounded animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconClipboardList size={40} className="text-[#E5E3DE]" />
            <p className="text-[#8A8785] text-sm">
              {isAr ? 'لا توجد طلبات نشطة' : 'No active orders'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F7F4] text-[#8A8785] text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-start font-medium">{isAr ? 'رقم الطلب' : 'Order'}</th>
                  <th className="px-5 py-3 text-start font-medium">{isAr ? 'الطاولة' : 'Table'}</th>
                  <th className="px-5 py-3 text-start font-medium">{isAr ? 'المبلغ' : 'Amount'}</th>
                  <th className="px-5 py-3 text-start font-medium">{isAr ? 'الوقت' : 'Time'}</th>
                  <th className="px-5 py-3 text-start font-medium">{isAr ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={order.id} className={`border-t border-[#E5E3DE] hover:bg-[#FBF0EB]/40 transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFAF8]'}`}>
                    <td className="px-5 py-3.5 font-medium text-[#111110]">#{order.id}</td>
                    <td className="px-5 py-3.5 text-[#4A4845]">T-{order.table_id}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#111110]">${Number(order.total_amount || 0).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-[#8A8785]">
                      <div className="flex items-center gap-1">
                        <IconClock size={13} />
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard