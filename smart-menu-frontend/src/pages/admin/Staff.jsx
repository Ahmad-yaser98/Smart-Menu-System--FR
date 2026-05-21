import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconPlus, IconEdit, IconTrash, IconSearch, IconUser
} from '@tabler/icons-react'
import API from '../../services/authService'
import toast from 'react-hot-toast'

const roleConfig = {
  admin:   { label: 'مدير',   labelEn: 'Admin',   bg: 'bg-purple-50', text: 'text-purple-700' },
  waiter:  { label: 'ويتر',   labelEn: 'Waiter',  bg: 'bg-blue-50',   text: 'text-blue-700'   },
  kitchen: { label: 'مطبخ',   labelEn: 'Kitchen', bg: 'bg-amber-50',  text: 'text-amber-700'  },
  cashier: { label: 'كاشير',  labelEn: 'Cashier', bg: 'bg-red-50',    text: 'text-red-700'    },
}

function RoleBadge({ role, isAr }) {
  const r = roleConfig[role] || roleConfig.waiter
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.bg} ${r.text}`}>
      {isAr ? r.label : r.labelEn}
    </span>
  )
}

// ===== Modal إضافة/تعديل =====
function StaffModal({ staff, onClose, onSave, isAr }) {
  const [form, setForm] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    password: '',
    role: staff?.role || 'waiter',
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DE]">
          <h3 className="font-semibold text-[#111110]">
            {staff ? (isAr ? 'تعديل موظف' : 'Edit Staff') : (isAr ? 'إضافة موظف' : 'Add Staff')}
          </h3>
          <button onClick={onClose} className="text-[#8A8785] hover:text-[#111110] text-xl">×</button>
        </div>
        <div className="p-6 flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'الاسم' : 'Name'}</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">
              {isAr ? (staff ? 'كلمة المرور الجديدة (اختياري)' : 'كلمة المرور') : (staff ? 'New Password (optional)' : 'Password')}
            </label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'الدور' : 'Role'}</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B]">
              <option value="admin">{isAr ? 'مدير' : 'Admin'}</option>
              <option value="waiter">{isAr ? 'ويتر' : 'Waiter'}</option>
              <option value="kitchen">{isAr ? 'مطبخ' : 'Kitchen'}</option>
              <option value="cashier">{isAr ? 'كاشير' : 'Cashier'}</option>
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#E5E3DE] text-sm font-medium text-[#4A4845] hover:bg-[#F8F7F4]">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button onClick={() => onSave(form)}
              className="flex-1 py-2.5 rounded-lg bg-[#D95F2B] text-white text-sm font-medium hover:bg-[#C04E1F]">
              {isAr ? 'حفظ' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Confirm Delete =====
function ConfirmModal({ name, onConfirm, onCancel, isAr }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
          <IconTrash size={24} className="text-red-500" />
        </div>
        <h3 className="font-semibold text-[#111110]">{isAr ? 'حذف الموظف؟' : 'Delete Staff?'}</h3>
        <p className="text-sm text-[#8A8785] text-center">
          {isAr ? `سيتم حذف "${name}" نهائياً` : `"${name}" will be permanently deleted`}
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-[#E5E3DE] text-sm font-medium text-[#4A4845]">
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

// ===== الصفحة الرئيسية =====
function Staff() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchStaff = async () => {
    try {
      const res = await API.get('/users')
      setStaff(res.data.data || res.data || [])
    } catch {
      toast.error(isAr ? 'فشل تحميل الموظفين' : 'Failed to load staff')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStaff() }, [])

  const handleSave = async (form) => {
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      if (modal?.id) {
        await API.put(`/users/${modal.id}`, payload)
        toast.success(isAr ? 'تم التعديل' : 'Updated!')
      } else {
        await API.post('/users', payload)
        toast.success(isAr ? 'تمت الإضافة' : 'Added!')
      }
      setModal(null)
      fetchStaff()
    } catch {
      toast.error(isAr ? 'حدث خطأ' : 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await API.delete(`/users/${deleteTarget.id}`)
      toast.success(isAr ? 'تم الحذف' : 'Deleted!')
      setDeleteTarget(null)
      fetchStaff()
    } catch {
      toast.error(isAr ? 'فشل الحذف' : 'Delete failed')
    }
  }

  const filtered = staff.filter(s => {
    const matchRole = filterRole === 'all' || s.role === filterRole
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111110]">
            {isAr ? 'إدارة الموظفين' : 'Staff Management'}
          </h2>
          <p className="text-sm text-[#8A8785]">
            {staff.length} {isAr ? 'موظف' : 'members'}
          </p>
        </div>
        <button onClick={() => setModal('add')}
          className="flex items-center gap-2 bg-[#D95F2B] hover:bg-[#C04E1F] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <IconPlus size={16} />
          {isAr ? 'إضافة موظف' : 'Add Staff'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <IconSearch size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8A8785]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث...' : 'Search...'}
            className="ps-9 pe-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] w-64" />
        </div>
        <div className="flex gap-2">
          {['all', 'admin', 'waiter', 'kitchen', 'cashier'].map(role => (
            <button key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterRole === role
                  ? 'bg-[#D95F2B] text-white'
                  : 'bg-white border border-[#E5E3DE] text-[#4A4845] hover:border-[#D95F2B]'
              }`}>
              {role === 'all'
                ? (isAr ? 'الكل' : 'All')
                : (isAr ? roleConfig[role]?.label : roleConfig[role]?.labelEn)
              }
              <span className="ms-1.5 opacity-70">
                {role === 'all' ? staff.length : staff.filter(s => s.role === role).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E3DE] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F7F4] text-[#8A8785] text-xs uppercase tracking-wide border-b border-[#E5E3DE]">
              <th className="px-5 py-3 text-start font-medium">{isAr ? 'الموظف' : 'Staff'}</th>
              <th className="px-5 py-3 text-start font-medium">{isAr ? 'البريد' : 'Email'}</th>
              <th className="px-5 py-3 text-start font-medium">{isAr ? 'الدور' : 'Role'}</th>
              <th className="px-5 py-3 text-start font-medium">{isAr ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-[#E5E3DE]">
                  {Array(4).fill(0).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-[#EDEBE6] rounded animate-pulse w-24"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-[#8A8785]">
                  <IconUser size={36} className="mx-auto mb-2 text-[#E5E3DE]" />
                  {isAr ? 'لا يوجد موظفون' : 'No staff found'}
                </td>
              </tr>
            ) : (
              filtered.map((member, i) => (
                <tr key={member.id}
                  className={`border-b border-[#E5E3DE] hover:bg-[#FBF0EB]/30 transition-colors ${i % 2 !== 0 ? 'bg-[#FAFAF8]' : ''}`}>

                  {/* Avatar + Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FBF0EB] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#D95F2B] text-xs font-semibold">
                          {member.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-[#111110]">{member.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-[#4A4845]">{member.email}</td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <RoleBadge role={member.role} isAr={isAr} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(member)}
                        className="p-1.5 rounded-lg border border-[#E5E3DE] text-[#4A4845] hover:border-[#D95F2B] hover:text-[#D95F2B] transition-colors">
                        <IconEdit size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(member)}
                        className="p-1.5 rounded-lg border border-[#E5E3DE] text-[#4A4845] hover:border-red-400 hover:text-red-500 transition-colors">
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modal && (
        <StaffModal
          staff={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isAr={isAr}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isAr={isAr}
        />
      )}
    </div>
  )
}

export default Staff