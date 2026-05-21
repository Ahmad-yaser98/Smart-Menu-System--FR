import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconArmchair,
  IconPlus,
  IconEdit,
  IconTrash,
  IconLayoutGrid,
  IconLayout,
  IconUser,
} from '@tabler/icons-react'
import API from '../../services/authService'
import toast from 'react-hot-toast'

const statusConfig = {
  available: { label: 'متاح',   labelEn: 'Available', bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500',  card: 'border-green-200' },
  occupied:  { label: 'مشغول',  labelEn: 'Occupied',  bg: 'bg-[#FBF0EB]', text: 'text-[#D95F2B]', dot: 'bg-[#D95F2B]', card: 'border-[#D95F2B]/30' },
  reserved:  { label: 'محجوز',  labelEn: 'Reserved',  bg: 'bg-blue-50',   text: 'text-blue-700',  dot: 'bg-blue-500',  card: 'border-blue-200' },
}

function StatusBadge({ status, isAr }) {
  const s = statusConfig[status] || statusConfig.available
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
      {isAr ? s.label : s.labelEn}
    </span>
  )
}

// Modal إضافة/تعديل طاولة
function TableModal({ table, onClose, onSave, isAr }) {
  const [form, setForm] = useState({
    table_number: table?.table_number || '',
    capacity: table?.capacity || '',
    status: table?.status || 'available',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DE]">
          <h3 className="font-semibold text-[#111110]">
            {table ? (isAr ? 'تعديل الطاولة' : 'Edit Table') : (isAr ? 'إضافة طاولة' : 'Add Table')}
          </h3>
          <button onClick={onClose} className="text-[#8A8785] hover:text-[#111110] text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'رقم الطاولة' : 'Table Number'}</label>
            <input
              type="number"
              value={form.table_number}
              onChange={e => setForm({ ...form, table_number: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'عدد المقاعد' : 'Capacity'}</label>
            <input
              type="number"
              value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'الحالة' : 'Status'}</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B]"
            >
              <option value="available">{isAr ? 'متاح' : 'Available'}</option>
              <option value="occupied">{isAr ? 'مشغول' : 'Occupied'}</option>
              <option value="reserved">{isAr ? 'محجوز' : 'Reserved'}</option>
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#E5E3DE] text-sm font-medium text-[#4A4845] hover:bg-[#F8F7F4]">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#D95F2B] text-white text-sm font-medium hover:bg-[#C04E1F]">
              {isAr ? 'حفظ' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Confirm Delete Modal
function ConfirmModal({ onConfirm, onCancel, isAr }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
          <IconTrash size={24} className="text-red-500" />
        </div>
        <h3 className="font-semibold text-[#111110] text-center">
          {isAr ? 'حذف الطاولة؟' : 'Delete Table?'}
        </h3>
        <p className="text-sm text-[#8A8785] text-center">
          {isAr ? 'هذا الإجراء لا يمكن التراجع عنه' : 'This action cannot be undone'}
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-[#E5E3DE] text-sm font-medium text-[#4A4845] hover:bg-[#F8F7F4]">
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600">
            {isAr ? 'حذف' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Tables() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid') // grid | floor
  const [modal, setModal] = useState(null) // null | 'add' | table object
  const [deleteId, setDeleteId] = useState(null)

  

  const fetchTables = async () => {
    try {
      const res = await API.get('/tables')
      setTables(res.data.data || res.data || [])
    } catch {
      toast.error(isAr ? 'فشل تحميل الطاولات' : 'Failed to load tables')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTables() }, [])

  const handleSave = async (form) => {
    try {
      const payload = {
        ...form,
        table_number: Number(form.table_number),
        capacity: Number(form.capacity)
      }
      if (modal?.id) {
        await API.put(`/tables/${modal.id}`, payload)
        toast.success(isAr ? 'تم التعديل' : 'Updated!')
      } else {
        await API.post('/tables', payload)
        toast.success(isAr ? 'تمت الإضافة' : 'Added!')
      }
      setModal(null)
      fetchTables()
    } catch (err) {
      toast.error(err.response?.data?.message || (isAr ? 'حدث خطأ' : 'Something went wrong'))
    }
  }

  const handleDelete = async () => {
    try {
      await API.delete(`/tables/${deleteId}`)
      toast.success(isAr ? 'تم الحذف' : 'Deleted!')
      setDeleteId(null)
      fetchTables()
    } catch (err) {
      toast.error(err.response?.data?.message || (isAr ? 'فشل الحذف لا يمكن حذف طاولة لها طلبات' : 'Delete failed'))
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111110]">
            {isAr ? 'إدارة الطاولات' : 'Tables Management'}
          </h2>
          <p className="text-sm text-[#8A8785]">
            {tables.length} {isAr ? 'طاولة' : 'tables'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-[#F8F7F4] rounded-lg p-1 border border-[#E5E3DE]">
            <button onClick={() => setView('grid')}
              className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-[#D95F2B]' : 'text-[#8A8785]'}`}>
              <IconLayoutGrid size={16} />
            </button>
            <button onClick={() => setView('floor')}
              className={`p-2 rounded-md transition-colors ${view === 'floor' ? 'bg-white shadow-sm text-[#D95F2B]' : 'text-[#8A8785]'}`}>
              <IconLayout size={16} />
            </button>
          </div>
          {/* Add Button */}
          <button onClick={() => setModal('add')}
            className="flex items-center gap-2 bg-[#D95F2B] hover:bg-[#C04E1F] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <IconPlus size={16} />
            {isAr ? 'إضافة طاولة' : 'Add Table'}
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex gap-3">
        {Object.entries(statusConfig).map(([key, s]) => (
          <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${s.bg} border ${s.card}`}>
            <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
            <span className={`text-xs font-medium ${s.text}`}>{isAr ? s.label : s.labelEn}</span>
            <span className={`text-xs font-semibold ${s.text}`}>
              {tables.filter(t => t.status === key).length}
            </span>
          </div>
        ))}
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E5E3DE] p-5 animate-pulse h-36">
                  <div className="h-4 bg-[#EDEBE6] rounded w-20 mb-3"></div>
                  <div className="h-6 bg-[#EDEBE6] rounded w-12 mb-4"></div>
                  <div className="h-3 bg-[#EDEBE6] rounded w-16"></div>
                </div>
              ))
            : tables.map(table => (
                <div key={table.id}
                  className={`bg-white rounded-xl border-2 p-5 flex flex-col gap-3 hover:shadow-md transition-all group ${statusConfig[table.status]?.card || 'border-[#E5E3DE]'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[#111110]">
                        {isAr ? 'طاولة' : 'Table'} {table.table_number}
                      </p>
                      <div className="flex items-center gap-1 text-[#8A8785] text-xs mt-1">
                        <IconArmchair size={13} />
                        <span>{table.capacity} {isAr ? 'مقعد' : 'seats'}</span>
                      </div>
                    </div>
                    <StatusBadge status={table.status} isAr={isAr} />
                  </div>
                  {table.waiter && (
                    <div className="flex items-center gap-1.5 text-xs text-[#4A4845]">
                      <IconUser size={13} className="text-[#D95F2B]" />
                      <span>{table.waiter.name}</span>
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal(table)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#E5E3DE] text-xs text-[#4A4845] hover:border-[#D95F2B] hover:text-[#D95F2B]">
                      <IconEdit size={13} />
                      {isAr ? 'تعديل' : 'Edit'}
                    </button>
                    <button onClick={() => setDeleteId(table.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#E5E3DE] text-xs text-[#4A4845] hover:border-red-400 hover:text-red-500">
                      <IconTrash size={13} />
                      {isAr ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {/* Floor Plan View */}
      {view === 'floor' && (
        <div className="bg-[#1A1A18] rounded-2xl p-8 min-h-80 relative">
          <p className="text-[#8A8785] text-xs mb-6 uppercase tracking-wide">
            {isAr ? 'مخطط المطعم' : 'Restaurant Floor Plan'}
          </p>
          <div className="flex flex-wrap gap-4">
            {tables.map(table => {
              const s = statusConfig[table.status] || statusConfig.available
              return (
                <div key={table.id}
                  className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:scale-105 transition-transform border-2
                    ${table.status === 'available' ? 'bg-green-700/80 border-green-500' :
                      table.status === 'occupied'  ? 'bg-[#D95F2B]/80 border-[#D95F2B]' :
                                                     'bg-blue-700/80 border-blue-500'}`}>
                  <IconArmchair size={22} className="text-white" />
                  <p className="text-white text-sm font-semibold">{table.table_number}</p>
                  <p className="text-white/70 text-xs">{table.capacity} ★</p>
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div className="flex gap-4 mt-6">
            {Object.entries(statusConfig).map(([key, s]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span>
                <span className="text-[#8A8785] text-xs">{isAr ? s.label : s.labelEn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {modal && (
        <TableModal
          table={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isAr={isAr}
        />
      )}
      {deleteId && (
        <ConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isAr={isAr}
        />
      )}
    </div>
  )
}

export default Tables