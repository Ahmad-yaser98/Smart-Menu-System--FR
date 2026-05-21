import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconPlus, IconMinus, IconTrash, IconShoppingCart, IconSearch
} from '@tabler/icons-react'
import API from '../../services/authService'
import toast from 'react-hot-toast'

function NewOrder() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const navigate = useNavigate()
  const location = useLocation()
  const table = location.state?.table

  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          API.get('/categories'),
          API.get('/menu-items'),
        ])
        setCategories(catRes.data.data || catRes.data || [])
        setItems((itemRes.data.data || itemRes.data || []).filter(i => i.is_available))
      } catch {
        toast.error(isAr ? 'فشل تحميل القائمة' : 'Failed to load menu')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredItems = items.filter(item => {
    const matchCat = selectedCat === 'all' || item.category_id == selectedCat
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
      .filter(c => c.qty > 0)
    )
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id))

  const total = cart.reduce((sum, c) => sum + Number(c.price) * c.qty, 0)

  const handleSubmit = async () => {
    if (!table) return toast.error(isAr ? 'لم يتم تحديد الطاولة' : 'No table selected')
    if (cart.length === 0) return toast.error(isAr ? 'السلة فارغة' : 'Cart is empty')

    setSubmitting(true)
    try {
      const userId = localStorage.getItem('user_id')

      // ① إنشاء الطلب
      const orderRes = await API.post('/orders', {
        table_id: table.id,
        waiter_id: userId,
        special_requests: notes || '',
        status: 'pending',
      })

      const orderId = orderRes.data?.order_id
        || orderRes.data?.data?.id
        || orderRes.data?.id

      if (!orderId) throw new Error('No order ID')

      // ② إضافة الأيتمز بالشكل الصح
      await API.post(`/orders/${orderId}/items`, {
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.qty,
        }))
      })

      toast.success(isAr ? 'تم إرسال الطلب!' : 'Order placed!')
      navigate('/waiter/tables')
    } catch (err) {
      console.error('Order error:', err.response?.data)
      toast.error(isAr ? 'فشل إرسال الطلب' : 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex gap-5 h-full">

      {/* Categories */}
      <div className="w-44 flex-shrink-0 flex flex-col gap-1">
        <p className="text-xs font-medium text-[#8A8785] uppercase tracking-wide mb-2">
          {isAr ? 'الأصناف' : 'Categories'}
        </p>
        <button onClick={() => setSelectedCat('all')}
          className={`px-3 py-2.5 rounded-lg text-sm font-medium text-start transition-colors ${
            selectedCat === 'all'
              ? 'bg-[#FBF0EB] text-[#D95F2B] border-s-2 border-[#D95F2B]'
              : 'text-[#4A4845] hover:bg-[#F8F7F4]'
          }`}>
          {isAr ? 'الكل' : 'All'}
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium text-start transition-colors ${
              selectedCat === cat.id
                ? 'bg-[#FBF0EB] text-[#D95F2B] border-s-2 border-[#D95F2B]'
                : 'text-[#4A4845] hover:bg-[#F8F7F4]'
            }`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Table info + Search */}
        <div className="flex items-center gap-3">
          {table && (
            <div className="bg-[#FBF0EB] px-3 py-2 rounded-lg flex-shrink-0">
              <p className="text-xs text-[#8A8785]">{isAr ? 'الطاولة' : 'Table'}</p>
              <p className="text-sm font-semibold text-[#D95F2B]">{table.table_number}</p>
            </div>
          )}
          <div className="relative flex-1">
            <IconSearch size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8A8785]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'بحث...' : 'Search...'}
              className="w-full ps-9 pe-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B]" />
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E5E3DE] p-4 h-28 animate-pulse">
                <div className="h-4 bg-[#EDEBE6] rounded w-24 mb-2"></div>
                <div className="h-3 bg-[#EDEBE6] rounded w-16 mb-4"></div>
                <div className="h-6 bg-[#EDEBE6] rounded w-12"></div>
              </div>
            ))
          ) : filteredItems.map(item => {
            const inCart = cart.find(c => c.id === item.id)
            return (
              <div key={item.id}
                className={`bg-white rounded-xl border-2 p-4 flex flex-col gap-2 cursor-pointer transition-all hover:shadow-md ${
                  inCart ? 'border-[#D95F2B]' : 'border-[#E5E3DE]'
                }`}
                onClick={() => addToCart(item)}>
                <div className="flex items-start justify-between">
                  <p className="font-medium text-[#111110] text-sm flex-1">{item.name}</p>
                  {inCart && (
                    <span className="bg-[#D95F2B] text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {inCart.qty}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#D95F2B] bg-[#FBF0EB] px-2 py-0.5 rounded-full w-fit">
                  {categories.find(c => c.id === item.category_id)?.name}
                </span>
                <div className="flex items-center justify-between mt-auto">
                  <p className="font-semibold text-[#111110]">${Number(item.price).toFixed(2)}</p>
                  <div className="w-7 h-7 bg-[#D95F2B] rounded-lg flex items-center justify-center">
                    <IconPlus size={14} className="text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cart */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-white rounded-xl border border-[#E5E3DE] flex flex-col flex-1 overflow-hidden">

          {/* Cart Header */}
          <div className="px-4 py-3 border-b border-[#E5E3DE] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconShoppingCart size={18} className="text-[#D95F2B]" />
              <h3 className="font-semibold text-[#111110] text-sm">
                {isAr ? 'الطلب' : 'Order'}
              </h3>
            </div>
            <span className="text-xs bg-[#FBF0EB] text-[#D95F2B] px-2 py-0.5 rounded-full font-medium">
              {cart.length} {isAr ? 'صنف' : 'items'}
            </span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E3DE]">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <IconShoppingCart size={32} className="text-[#E5E3DE]" />
                <p className="text-sm text-[#8A8785]">
                  {isAr ? 'السلة فارغة' : 'Cart is empty'}
                </p>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111110] truncate">{item.name}</p>
                  <p className="text-xs text-[#8A8785]">${Number(item.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => updateQty(item.id, -1)}
                    className="w-6 h-6 rounded-md border border-[#E5E3DE] flex items-center justify-center hover:border-[#D95F2B] hover:text-[#D95F2B]">
                    <IconMinus size={12} />
                  </button>
                  <span className="text-sm font-medium w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 rounded-md border border-[#E5E3DE] flex items-center justify-center hover:border-[#D95F2B] hover:text-[#D95F2B]">
                    <IconPlus size={12} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)}
                    className="w-6 h-6 rounded-md border border-[#E5E3DE] flex items-center justify-center hover:border-red-400 hover:text-red-500 ms-1">
                    <IconTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="px-4 py-3 border-t border-[#E5E3DE]">
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder={isAr ? 'ملاحظات خاصة...' : 'Special requests...'}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E3DE] text-xs outline-none focus:border-[#D95F2B] resize-none" />
          </div>

          {/* Total + Submit */}
          <div className="px-4 py-4 border-t border-[#E5E3DE] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4A4845]">{isAr ? 'المجموع' : 'Total'}</span>
              <span className="text-lg font-semibold text-[#111110]">${total.toFixed(2)}</span>
            </div>
            <button onClick={handleSubmit} disabled={submitting || cart.length === 0}
              className="w-full bg-[#D95F2B] hover:bg-[#C04E1F] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-medium transition-colors">
              {submitting
                ? (isAr ? 'جاري الإرسال...' : 'Placing order...')
                : (isAr ? 'إرسال الطلب' : 'Place Order')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewOrder