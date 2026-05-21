import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconPlus, IconEdit, IconTrash,
  IconToolsKitchen2, IconSearch, IconToggleLeft, IconToggleRight
} from '@tabler/icons-react'
import API from '../../services/authService'
import toast from 'react-hot-toast'

// ===== Modal إضافة/تعديل وجبة =====
function ItemModal({ item, categories, onClose, onSave, isAr }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    category_id: item?.category_id || '',
    price: item?.price || '',
    description: item?.description || '',
    is_available: item?.is_available ?? true,
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DE]">
          <h3 className="font-semibold text-[#111110]">
            {item ? (isAr ? 'تعديل الوجبة' : 'Edit Item') : (isAr ? 'إضافة وجبة' : 'Add Item')}
          </h3>
          <button onClick={onClose} className="text-[#8A8785] hover:text-[#111110] text-xl">×</button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'اسم الوجبة' : 'Item Name'}</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'الصنف' : 'Category'}</label>
            <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B]">
              <option value="">{isAr ? 'اختر صنفاً' : 'Select category'}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'السعر' : 'Price'}</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'الوصف' : 'Description'}</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              rows={3} className="w-full px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] focus:ring-2 focus:ring-[#D95F2B]/20 resize-none" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#4A4845]">{isAr ? 'متاح' : 'Available'}</label>
            <button onClick={() => setForm({...form, is_available: !form.is_available})}>
              {form.is_available
                ? <IconToggleRight size={32} className="text-[#D95F2B]" />
                : <IconToggleLeft size={32} className="text-[#8A8785]" />}
            </button>
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

// ===== Modal حذف =====
function ConfirmModal({ onConfirm, onCancel, isAr }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
          <IconTrash size={24} className="text-red-500" />
        </div>
        <h3 className="font-semibold text-[#111110]">{isAr ? 'حذف الوجبة؟' : 'Delete Item?'}</h3>
        <p className="text-sm text-[#8A8785] text-center">{isAr ? 'هذا الإجراء لا يمكن التراجع عنه' : 'This cannot be undone'}</p>
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
function Menu() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const fetchData = async () => {
    try {
      const [catRes, itemRes] = await Promise.all([
        API.get('/categories'),
        API.get('/menu-items'),
      ])
      setCategories(catRes.data.data || catRes.data || [])
      setItems(itemRes.data.data || itemRes.data || [])
    } catch {
      toast.error(isAr ? 'فشل تحميل البيانات' : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async (form) => {
    try {
      if (modal?.id) {
        await API.put(`/menu-items/${modal.id}`, form)
        toast.success(isAr ? 'تم التعديل' : 'Updated!')
      } else {
        await API.post('/menu-items', form)
        toast.success(isAr ? 'تمت الإضافة' : 'Added!')
      }
      setModal(null)
      fetchData()
    } catch {
      toast.error(isAr ? 'حدث خطأ' : 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await API.delete(`/menu-items/${deleteId}`)
      toast.success(isAr ? 'تم الحذف' : 'Deleted!')
      setDeleteId(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || (isAr ? 'ფشل الحذف قد يكون الصنف مرتبطاً بطلبات سابقة' : 'Delete failed'))
    }
  }

 const handleToggle = async (item) => {
  try {
    await API.put(`/menu-items/${item.id}`, {
      name: item.name,
      category_id: item.category_id,
      price: item.price,
      description: item.description,
      is_available: !item.is_available,
    })
    fetchData()
    toast.success(isAr ? 'تم التحديث' : 'Updated!')
  } catch {
    toast.error(isAr ? 'حدث خطأ' : 'Error')
  }
}

  const filteredItems = items.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category_id == selectedCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="flex gap-5 h-full">

      {/* Categories Panel */}
      <div className="w-52 flex-shrink-0 flex flex-col gap-2">
        <p className="text-xs font-medium text-[#8A8785] uppercase tracking-wide mb-1">
          {isAr ? 'الأصناف' : 'Categories'}
        </p>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#FBF0EB] text-[#D95F2B] border-s-2 border-[#D95F2B]'
              : 'text-[#4A4845] hover:bg-[#F8F7F4]'
          }`}>
          <span>{isAr ? 'الكل' : 'All'}</span>
          <span className="text-xs bg-[#F8F7F4] px-2 py-0.5 rounded-full">{items.length}</span>
        </button>
        {categories.map(cat => (
          <button key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#FBF0EB] text-[#D95F2B] border-s-2 border-[#D95F2B]'
                : 'text-[#4A4845] hover:bg-[#F8F7F4]'
            }`}>
            <span>{cat.name}</span>
            <span className="text-xs bg-[#F8F7F4] px-2 py-0.5 rounded-full">
              {items.filter(i => i.category_id === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Items Panel */}
      <div className="flex-1 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-xs">
              <IconSearch size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8A8785]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isAr ? 'بحث...' : 'Search...'}
                className="w-full ps-9 pe-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B]"
              />
            </div>
            <span className="text-sm text-[#8A8785]">
              {filteredItems.length} {isAr ? 'وجبة' : 'items'}
            </span>
          </div>
          <button onClick={() => setModal('add')}
            className="flex items-center gap-2 bg-[#D95F2B] hover:bg-[#C04E1F] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <IconPlus size={16} />
            {isAr ? 'إضافة وجبة' : 'Add Item'}
          </button>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E5E3DE] p-4 animate-pulse h-40">
                <div className="h-4 bg-[#EDEBE6] rounded w-24 mb-3"></div>
                <div className="h-3 bg-[#EDEBE6] rounded w-16 mb-4"></div>
                <div className="h-6 bg-[#EDEBE6] rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <IconToolsKitchen2 size={40} className="text-[#E5E3DE]" />
            <p className="text-[#8A8785] text-sm">{isAr ? 'لا توجد وجبات' : 'No items found'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item.id}
               className="relative bg-white rounded-xl border border-[#E5E3DE] p-4 flex flex-col gap-3 hover:shadow-md transition-all group">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[#111110] text-sm">{item.name}</p>
                    <span className="text-xs text-[#D95F2B] bg-[#FBF0EB] px-2 py-0.5 rounded-full mt-1 inline-block">
                      {categories.find(c => c.id === item.category_id)?.name || '—'}
                    </span>
                  </div>
                  {/* Toggle */}
                  <button onClick={() => handleToggle(item)}>
                    {item.is_available
                      ? <IconToggleRight size={24} className="text-[#D95F2B]" />
                      : <IconToggleLeft size={24} className="text-[#8A8785]" />}
                  </button>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-[#8A8785] line-clamp-2">{item.description}</p>
                )}

                {/* Price + Actions */}
                <div className="flex items-center justify-between mt-auto">
                  <p className="font-semibold text-[#111110]">${Number(item.price).toFixed(2)}</p>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal(item)}
                      className="p-1.5 rounded-lg border border-[#E5E3DE] text-[#4A4845] hover:border-[#D95F2B] hover:text-[#D95F2B]">
                      <IconEdit size={14} />
                    </button>
                    <button onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg border border-[#E5E3DE] text-[#4A4845] hover:border-red-400 hover:text-red-500">
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>

                {/* Unavailable overlay */}
                {!item.is_available && (
                  <div className="absolute inset-0 bg-white/60 rounded-xl flex items-center justify-center pointer-events-none">
                 <span className="text-xs font-medium text-[#8A8785] bg-white px-3 py-1 rounded-full border border-[#E5E3DE]">
                   {isAr ? 'غير متاح' : 'Unavailable'}
                        </span>
                        </div>
                     )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <ItemModal
          item={modal === 'add' ? null : modal}
          categories={categories}
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

export default Menu