import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IconClock, IconChefHat, IconCheck, IconVolume, IconVolumeOff } from '@tabler/icons-react'
import API from '../../services/authService'
import toast from 'react-hot-toast'

function Timer({ createdAt }) {
  const [elapsed, setElapsed] = useState('')
  const [isLate, setIsLate] = useState(false)

  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000)
      const m = Math.floor(diff / 60)
      const s = diff % 60
      setElapsed(`${m}:${s.toString().padStart(2, '0')}`)
      setIsLate(m >= 20)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [createdAt])

  return (
    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
      isLate ? 'bg-red-100 text-red-600' : 'bg-[#F8F7F4] text-[#8A8785]'
    }`}>
      <IconClock size={12} />
      {elapsed}
    </span>
  )
}

const columns = [
  { key: 'pending',    labelAr: 'جديد',         labelEn: 'New',        bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-500'   },
  { key: 'preparing', labelAr: 'قيد التحضير',   labelEn: 'Preparing',  bg: 'bg-[#FBF0EB]', border: 'border-[#D95F2B]/30', badge: 'bg-[#D95F2B]' },
  { key: 'ready',     labelAr: 'جاهز',          labelEn: 'Ready',      bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-500'  },
]

function OrderCard({ order, onUpdateStatus, isAr }) {
  const status = order.status

  return (
    <div className={`bg-white rounded-xl border p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all ${
      status === 'pending' ? 'border-blue-200' :
      status === 'preparing' ? 'border-[#D95F2B]/40' :
      'border-green-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-[#111110]">#{order.id}</p>
          <p className="text-xs text-[#8A8785]">
            {isAr ? 'طاولة' : 'Table'} {order.table_id}
          </p>
        </div>
        <Timer createdAt={order.created_at} />
      </div>

      {/* Items */}
      <div className="flex flex-col gap-1.5 border-t border-[#E5E3DE] pt-3">
        {order.items?.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-[#4A4845]">{item.menu_item?.name || `Item #${item.menu_item_id}`}</span>
            <span className="font-medium text-[#111110] bg-[#F8F7F4] px-2 py-0.5 rounded-full text-xs">
              ×{item.quantity}
            </span>
          </div>
        )) || (
          <p className="text-xs text-[#8A8785]">{isAr ? 'لا توجد تفاصيل' : 'No details'}</p>
        )}
      </div>

      {/* Special requests */}
      {order.special_requests && (
        <div className="bg-[#FBF0EB] rounded-lg px-3 py-2 text-xs text-[#D95F2B]">
          📝 {order.special_requests}
        </div>
      )}

      {/* Action Button */}
      {status !== 'ready' && (
        <button
          onClick={() => onUpdateStatus(order.id, status === 'pending' ? 'preparing' : 'ready')}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            status === 'pending'
              ? 'bg-[#D95F2B] hover:bg-[#C04E1F] text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}>
          {status === 'pending' ? (
            <><IconChefHat size={16} />{isAr ? 'بدء التحضير' : 'Start Preparing'}</>
          ) : (
            <><IconCheck size={16} />{isAr ? 'جاهز للتقديم' : 'Mark Ready'}</>
          )}
        </button>
      )}

      {status === 'ready' && (
        <div className="w-full py-2 rounded-lg text-sm font-medium bg-green-50 text-green-600 flex items-center justify-center gap-2 border border-green-200">
          <IconCheck size={16} />
          {isAr ? 'جاهز ✓' : 'Ready ✓'}
        </div>
      )}
    </div>
  )
}

function KitchenOrders() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [sound, setSound] = useState(true)
  const prevCountRef = useRef(0)
  const bellRef = useRef(null)

  useEffect(() => {
    bellRef.current = new Audio('/bell.mp3')
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get('/kitchen/orders')
      const data = res.data.data || res.data || []
      
      // صوت تنبيه لو في طلب جديد
      if (sound && data.length > prevCountRef.current && prevCountRef.current > 0) {
         if (bellRef.current) {
             bellRef.current.play().catch(() => {})
         }
      }
      
      prevCountRef.current = data.length
      setOrders(data)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [sound])

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/kitchen/orders/${orderId}/status`, { status: newStatus })
      toast.success(
        newStatus === 'preparing'
          ? (isAr ? 'بدأ التحضير' : 'Preparing started')
          : (isAr ? 'الطلب جاهز!' : 'Order ready!')
      )
      fetchOrders()
    } catch {
      toast.error(isAr ? 'حدث خطأ' : 'Error')
    }
  }

  const getColumnOrders = (status) => orders.filter(o => o.status === status)

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111110]">
            {isAr ? 'لوحة المطبخ' : 'Kitchen Board'}
          </h2>
          <p className="text-sm text-[#8A8785]">
            {isAr ? 'تحديث تلقائي كل 10 ثواني' : 'Auto-refresh every 10s'}
          </p>
        </div>
        <button
          onClick={() => setSound(!sound)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            sound
              ? 'border-[#D95F2B] text-[#D95F2B] bg-[#FBF0EB]'
              : 'border-[#E5E3DE] text-[#8A8785]'
          }`}>
          {sound ? <IconVolume size={16} /> : <IconVolumeOff size={16} />}
          {sound ? (isAr ? 'صوت شغال' : 'Sound On') : (isAr ? 'صوت مغلق' : 'Sound Off')}
        </button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden">
        {columns.map(col => (
          <div key={col.key} className={`rounded-xl border ${col.bg} ${col.border} flex flex-col overflow-hidden`}>

            {/* Column Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/50">
              <h3 className="font-semibold text-[#111110] text-sm">
                {isAr ? col.labelAr : col.labelEn}
              </h3>
              <span className={`${col.badge} text-white text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center`}>
                {getColumnOrders(col.key).length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 h-36 animate-pulse">
                    <div className="h-4 bg-[#EDEBE6] rounded w-16 mb-3"></div>
                    <div className="h-3 bg-[#EDEBE6] rounded w-24 mb-2"></div>
                    <div className="h-3 bg-[#EDEBE6] rounded w-20"></div>
                  </div>
                ))
              ) : getColumnOrders(col.key).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-50">
                  <IconChefHat size={28} className="text-[#8A8785]" />
                  <p className="text-xs text-[#8A8785]">
                    {isAr ? 'لا توجد طلبات' : 'No orders'}
                  </p>
                </div>
              ) : (
                getColumnOrders(col.key).map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                    isAr={isAr}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KitchenOrders