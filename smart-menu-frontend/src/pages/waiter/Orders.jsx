import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconClock, IconCheck, IconClipboardList } from '@tabler/icons-react'
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

const statusConfig = {
  pending:   { labelAr: 'قيد الانتظار', labelEn: 'Pending',    bg: 'bg-blue-50',   text: 'text-blue-700'   },
  preparing: { labelAr: 'قيد التحضير', labelEn: 'Preparing',   bg: 'bg-[#FBF0EB]', text: 'text-[#D95F2B]'  },
  ready:     { labelAr: 'جاهز للتقديم', labelEn: 'Ready',      bg: 'bg-green-50',  text: 'text-green-700'  },
  served:    { labelAr: 'تم التقديم',   labelEn: 'Served',     bg: 'bg-purple-50', text: 'text-purple-700' },
}

function WaiterOrders() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [readyCount, setReadyCount] = useState(0)

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/active')
      const data = res.data.data || res.data || []
      setOrders(data)
      // عدد الطلبات الجاهزة للتنبيه
      const ready = data.filter(o => o.status === 'ready').length
      if (ready > readyCount && readyCount > 0) {
        toast.success(isAr ? `🔔 ${ready} طلب جاهز للتقديم!` : `🔔 ${ready} order(s) ready!`, {
          duration: 5000,
        })
      }
      setReadyCount(ready)
    } catch {
      toast.error(isAr ? 'فشل تحميل الطلبات' : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleServe = async (orderId) => {
    try {
      await API.patch(`/orders/${orderId}/serve`)
      toast.success(isAr ? 'تم تقديم الطلب للزبون!' : 'Order served!')
      fetchOrders()
    } catch {
      toast.error(isAr ? 'حدث خطأ' : 'Error')
    }
  }

  const readyOrders = orders.filter(o => o.status === 'ready')
  const otherOrders = orders.filter(o => o.status !== 'ready')

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111110]">
            {isAr ? 'طلباتي النشطة' : 'My Active Orders'}
          </h2>
          <p className="text-sm text-[#8A8785]">
            {isAr ? 'تحديث تلقائي كل 5 ثواني' : 'Auto-refresh every 5s'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {readyOrders.length > 0 && (
            <span className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full font-medium animate-pulse">
              🔔 {readyOrders.length} {isAr ? 'جاهز للتقديم' : 'ready to serve'}
            </span>
          )}
          <span className="text-xs bg-[#FBF0EB] text-[#D95F2B] px-3 py-1.5 rounded-full font-medium">
            {orders.length} {isAr ? 'طلب' : 'orders'}
          </span>
        </div>
      </div>

      {/* Ready Orders — أول شي */}
      {readyOrders.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {isAr ? 'جاهز للتقديم' : 'Ready to Serve'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyOrders.map(order => (
              <div key={order.id}
                className="bg-white rounded-xl border-2 border-green-400 p-5 flex flex-col gap-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#111110]">#{order.id}</p>
                    <p className="text-xs text-[#8A8785]">
                      {isAr ? 'طاولة' : 'Table'} {order.table_id}
                    </p>
                  </div>
                  <Timer createdAt={order.created_at} />
                </div>
                <div className="flex flex-col gap-1.5 border-t border-[#E5E3DE] pt-3">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#4A4845] truncate flex-1">
                        {item.menu_item?.name || `Item #${item.menu_item_id}`}
                      </span>
                      <span className="text-xs bg-[#F8F7F4] text-[#8A8785] px-2 py-0.5 rounded-full ms-2">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="text-xs text-[#8A8785]">
                      +{order.items.length - 3} {isAr ? 'أصناف أخرى' : 'more'}
                    </p>
                  )}
                </div>
                <button onClick={() => handleServe(order.id)}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <IconCheck size={16} />
                  {isAr ? 'تم التقديم للزبون ✓' : 'Mark as Served ✓'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Orders */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E5E3DE] p-5 h-48 animate-pulse">
              <div className="h-4 bg-[#EDEBE6] rounded w-20 mb-3"></div>
              <div className="h-3 bg-[#EDEBE6] rounded w-32 mb-2"></div>
              <div className="h-3 bg-[#EDEBE6] rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : otherOrders.length === 0 && readyOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <IconClipboardList size={48} className="text-[#E5E3DE]" />
          <p className="text-[#8A8785]">{isAr ? 'لا توجد طلبات نشطة' : 'No active orders'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherOrders.map(order => {
            const s = statusConfig[order.status] || statusConfig.pending
            return (
              <div key={order.id}
                className="bg-white rounded-xl border border-[#E5E3DE] p-5 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#111110]">#{order.id}</p>
                    <p className="text-xs text-[#8A8785]">
                      {isAr ? 'طاولة' : 'Table'} {order.table_id}
                    </p>
                  </div>
                  <Timer createdAt={order.created_at} />
                </div>
                <div className="flex flex-col gap-1.5 border-t border-[#E5E3DE] pt-3">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#4A4845] truncate flex-1">
                        {item.menu_item?.name || `Item #${item.menu_item_id}`}
                      </span>
                      <span className="text-xs bg-[#F8F7F4] text-[#8A8785] px-2 py-0.5 rounded-full ms-2">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="text-xs text-[#8A8785]">
                      +{order.items.length - 3} {isAr ? 'أصناف أخرى' : 'more'}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                    {isAr ? s.labelAr : s.labelEn}
                  </span>
                  <span className="font-semibold text-[#111110]">
                    ${Number(order.total_amount || 0).toFixed(2)}
                  </span>
                </div>
                {order.special_requests && (
                  <div className="bg-[#FBF0EB] rounded-lg px-3 py-2 text-xs text-[#D95F2B]">
                    📝 {order.special_requests}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WaiterOrders