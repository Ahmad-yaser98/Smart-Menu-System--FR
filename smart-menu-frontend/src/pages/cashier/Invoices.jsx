import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconReceipt, IconSearch } from '@tabler/icons-react'
import API from '../../services/authService'

function Invoices() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/invoices')
        setInvoices(res.data.data || res.data || [])
      } catch {
        setInvoices([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = invoices.filter(inv =>
    String(inv.id).includes(search) ||
    String(inv.order_id).includes(search)
  )

  const paymentBadge = {
    cash:   { labelAr: 'نقداً',  labelEn: 'Cash',   bg: 'bg-green-50',  text: 'text-green-700'  },
    card:   { labelAr: 'بطاقة',  labelEn: 'Card',   bg: 'bg-blue-50',   text: 'text-blue-700'   },
    wallet: { labelAr: 'محفظة',  labelEn: 'Wallet', bg: 'bg-purple-50', text: 'text-purple-700' },
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111110]">
            {isAr ? 'سجل الفواتير' : 'Invoice History'}
          </h2>
          <p className="text-sm text-[#8A8785]">
            {invoices.length} {isAr ? 'فاتورة' : 'invoices'}
          </p>
        </div>
        <div className="relative">
          <IconSearch size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8A8785]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث برقم الفاتورة...' : 'Search by invoice #...'}
            className="ps-9 pe-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm outline-none focus:border-[#D95F2B] w-56" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E3DE] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F7F4] text-[#8A8785] text-xs uppercase tracking-wide border-b border-[#E5E3DE]">
              <th className="px-5 py-3 text-start">{isAr ? 'رقم الفاتورة' : 'Invoice #'}</th>
              <th className="px-5 py-3 text-start">{isAr ? 'رقم الطلب' : 'Order #'}</th>
              <th className="px-5 py-3 text-start">{isAr ? 'المبلغ' : 'Amount'}</th>
              <th className="px-5 py-3 text-start">{isAr ? 'طريقة الدفع' : 'Payment'}</th>
              <th className="px-5 py-3 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-[#E5E3DE]">
                  {Array(5).fill(0).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-[#EDEBE6] rounded animate-pulse w-20"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-[#8A8785]">
                  <IconReceipt size={36} className="mx-auto mb-2 text-[#E5E3DE]" />
                  {isAr ? 'لا توجد فواتير' : 'No invoices found'}
                </td>
              </tr>
            ) : filtered.map((inv, i) => {
              const pm = paymentBadge[inv.payment_method] || paymentBadge.cash
              return (
                <tr key={inv.id}
                  className={`border-b border-[#E5E3DE] hover:bg-[#FBF0EB]/30 ${i % 2 !== 0 ? 'bg-[#FAFAF8]' : ''}`}>
                  <td className="px-5 py-4 font-medium text-[#111110]">#{inv.id}</td>
                  <td className="px-5 py-4 text-[#4A4845]">#{inv.order_id}</td>
                  <td className="px-5 py-4 font-semibold text-[#111110]">
                    ${Number(inv.total_amount || 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pm.bg} ${pm.text}`}>
                      {isAr ? pm.labelAr : pm.labelEn}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#8A8785] text-xs">
                    {new Date(inv.created_at).toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Invoices