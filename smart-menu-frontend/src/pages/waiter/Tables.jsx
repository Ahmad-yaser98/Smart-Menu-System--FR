import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconArmchair, IconPlus, IconClipboardList, IconClock } from '@tabler/icons-react'
import API from '../../services/authService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
  available: { label: 'متاح',  labelEn: 'Available', bg: 'bg-green-600',      border: 'border-green-500' },
  occupied:  { label: 'مشغول', labelEn: 'Occupied',  bg: 'bg-[#D95F2B]',     border: 'border-[#D95F2B]' },
  reserved:  { label: 'محجوز', labelEn: 'Reserved',  bg: 'bg-blue-600',       border: 'border-blue-500'  },
}

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
    <span className={`flex items-center gap-1 text-xs font-medium ${isLate ? 'text-red-400' : 'text-white/70'}`}>
      <IconClock size={12} />
      {elapsed}
    </span>
  )
}

function WaiterTables() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const navigate = useNavigate()

  const [tables, setTables] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const fetchData = async () => {
    try {
      const [tablesRes, ordersRes] = await Promise.all([
        API.get('/tables'),
        API.get('/orders/active'),
      ])
      setTables(tablesRes.data.data || tablesRes.data || [])
      setOrders(ordersRes.data.data || ordersRes.data || [])
    } catch {
      toast.error(isAr ? 'فشل تحميل البيانات' : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000) // auto refresh
    return () => clearInterval(interval)
  }, [])

  const getTableOrder = (tableId) => orders.find(o => o.table_id === tableId)

  const handleTableClick = (table) => setSelected(table)

  const handleUpdateStatus = async (tableId, status) => {
    try {
      await API.put(`/tables/${tableId}/status`, { status })
      toast.success(isAr ? 'تم تحديث الحالة' : 'Status updated!')
      setSelected(null)
      fetchData()
    } catch {
      toast.error(isAr ? 'حدث خطأ' : 'Error')
    }
  }

  return (
    <div className="flex gap-5 h-full">

      {/* Floor Plan */}
      <div className="flex-1 bg-[#1A1A18] rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#8A8785] text-xs uppercase tracking-wide">
            {isAr ? 'مخطط المطعم' : 'Restaurant Floor'}
          </p>
          <div className="flex items-center gap-4">
            {Object.entries(statusConfig).map(([key, s]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${s.bg}`}></div>
                <span className="text-[#8A8785] text-xs">{isAr ? s.label : s.labelEn}</span>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-wrap gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="w-24 h-24 rounded-xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 content-start">
            {tables.map(table => {
              const order = getTableOrder(table.id)
              const s = statusConfig[table.status] || statusConfig.available
              const isSelected = selected?.id === table.id

              return (
                <div key={table.id}
                  onClick={() => handleTableClick(table)}
                  className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer
                    transition-all border-2 hover:scale-105
                    ${s.bg} ${s.border}
                    ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1A1A18] scale-105' : ''}
                  `}>
                  <IconArmchair size={20} className="text-white" />
                  <p className="text-white text-sm font-semibold">{table.table_number}</p>
                  <p className="text-white/60 text-xs">{table.capacity}★</p>
                  {order && <Timer createdAt={order.created_at} />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="w-72 flex flex-col gap-4">
        {selected ? (
          <div className="bg-white rounded-xl border border-[#E5E3DE] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#111110]">
                {isAr ? 'طاولة' : 'Table'} {selected.table_number}
              </h3>
              <button onClick={() => setSelected(null)} className="text-[#8A8785] hover:text-[#111110]">×</button>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8A8785]">{isAr ? 'السعة' : 'Capacity'}</span>
                <span className="font-medium">{selected.capacity} {isAr ? 'مقعد' : 'seats'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8785]">{isAr ? 'الحالة' : 'Status'}</span>
                <span className={`font-medium ${
                  selected.status === 'available' ? 'text-green-600' :
                  selected.status === 'occupied' ? 'text-[#D95F2B]' : 'text-blue-600'
                }`}>
                  {isAr
                    ? statusConfig[selected.status]?.label
                    : statusConfig[selected.status]?.labelEn}
                </span>
              </div>
            </div>

            {/* الطلب الحالي */}
            {getTableOrder(selected.id) && (
              <div className="bg-[#FBF0EB] rounded-lg p-3">
                <p className="text-xs font-medium text-[#D95F2B] mb-1">
                  {isAr ? 'طلب نشط' : 'Active Order'}
                </p>
                <p className="text-sm font-semibold text-[#111110]">
                  #{getTableOrder(selected.id).id}
                </p>
                <p className="text-xs text-[#8A8785]">
                  ${Number(getTableOrder(selected.id).total_amount || 0).toFixed(2)}
                </p>
              </div>
            )}

            {/* الأزرار */}
            <div className="flex flex-col gap-2">
              {selected.status === 'available' ? (
                <button
                  onClick={() => navigate('/waiter/orders/new', { state: { table: selected } })}
                  className="flex items-center justify-center gap-2 w-full bg-[#D95F2B] hover:bg-[#C04E1F] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <IconPlus size={16} />
                  {isAr ? 'طلب جديد' : 'New Order'}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/waiter/orders')}
                  className="flex items-center justify-center gap-2 w-full bg-[#D95F2B] hover:bg-[#C04E1F] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <IconClipboardList size={16} />
                  {isAr ? 'عرض الطلب' : 'View Order'}
                </button>
              )}

              {/* تغيير الحالة */}
              <div className="flex gap-2">
                {Object.entries(statusConfig)
                  .filter(([key]) => key !== selected.status)
                  .map(([key, s]) => (
                    <button key={key}
                      onClick={() => handleUpdateStatus(selected.id, key)}
                      className="flex-1 py-2 rounded-lg border border-[#E5E3DE] text-xs text-[#4A4845] hover:border-[#D95F2B] hover:text-[#D95F2B] transition-colors">
                      {isAr ? s.label : s.labelEn}
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E3DE] p-5 flex flex-col items-center justify-center gap-3 h-48">
            <IconArmchair size={32} className="text-[#E5E3DE]" />
            <p className="text-sm text-[#8A8785] text-center">
              {isAr ? 'اضغط على طاولة لعرض التفاصيل' : 'Click a table to view details'}
            </p>
          </div>
        )}

        {/* Active Orders Summary */}
        <div className="bg-white rounded-xl border border-[#E5E3DE] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E3DE] flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#111110]">
              {isAr ? 'الطلبات النشطة' : 'Active Orders'}
            </h4>
            <span className="text-xs bg-[#FBF0EB] text-[#D95F2B] px-2 py-0.5 rounded-full font-medium">
              {orders.length}
            </span>
          </div>
          <div className="flex flex-col divide-y divide-[#E5E3DE] max-h-64 overflow-y-auto">
            {orders.length === 0 ? (
              <p className="text-center text-sm text-[#8A8785] py-6">
                {isAr ? 'لا توجد طلبات' : 'No active orders'}
              </p>
            ) : orders.map(order => (
              <div key={order.id} className="px-4 py-3 flex items-center justify-between hover:bg-[#F8F7F4]">
                <div>
                  <p className="text-sm font-medium text-[#111110]">#{order.id}</p>
                  <p className="text-xs text-[#8A8785]">T-{order.table_id}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-semibold text-[#111110]">
                    ${Number(order.total_amount || 0).toFixed(2)}
                  </p>
                  <Timer createdAt={order.created_at} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaiterTables