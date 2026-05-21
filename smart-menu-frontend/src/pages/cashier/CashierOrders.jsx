import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconReceipt, IconCreditCard, IconCash, IconWallet, IconPrinter } from '@tabler/icons-react'
import API from '../../services/authService'
import toast from 'react-hot-toast'

function CashierOrders() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [invoice, setInvoice] = useState(null)
  const [payMethod, setPayMethod] = useState('cash')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  const fetchOrders = async () => {
    try {
      const res = await API.get('/cashier/orders')
      setOrders(res.data.data || res.data || [])
    } catch {
      toast.error(isAr ? 'فشل تحميل الطلبات' : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleSelect = async (order) => {
    setSelected(order)
    setInvoice(null)
    try {
      const res = await API.get(`/invoices/${order.id}`)
      setInvoice(res.data.data || res.data)
    } catch {
      setInvoice(null)
    }
  }

  const handlePay = async () => {
  if (!selected) return
  setPaying(true)
  try {
    await API.post(`/invoices/${selected.id}/pay`, {
      payment_method: payMethod,  
    })
    toast.success(isAr ? 'تم الدفع بنجاح!' : 'Payment successful!')
    setSelected(null)
    setInvoice(null)
    fetchOrders()
  } catch (err) {
    console.error('Pay error:', err.response?.data)
    toast.error(isAr ? 'فشل الدفع' : 'Payment failed')
  } finally {
    setPaying(false)
  }
}

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${selected.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; max-width: 400px; margin: 0 auto; }
            h2 { text-align: center; color: #D95F2B; margin-bottom: 4px; }
            .subtitle { text-align: center; color: #888; font-size: 12px; margin-bottom: 0; }
            .divider { border: none; border-top: 1px dashed #ccc; margin: 14px 0; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; color: #888; font-size: 11px; padding: 5px 0; text-transform: uppercase; }
            td { padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-row { font-size: 18px; font-weight: bold; color: #111; }
            .pay-method { text-align: right; color: #888; font-size: 12px; margin-top: 6px; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
            .print-btn {
              width: 100%; padding: 12px;
              background: #D95F2B; color: white;
              border: none; border-radius: 8px;
              cursor: pointer; font-size: 14px;
              margin-top: 20px;
            }
            .print-btn:hover { background: #C04E1F; }
            @media print { .print-btn { display: none; } }
          </style>
        </head>
        <body>
          <h2>🍽 RestoHub</h2>
          <p class="subtitle">
            Invoice #${selected.id} &nbsp;|&nbsp; Table ${selected.table_id}<br/>
            ${new Date().toLocaleString()}
          </p>
          <hr class="divider"/>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Unit</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${selected.items?.map(item => `
                <tr>
                  <td>${item.menu_item?.name || 'Item'}</td>
                  <td class="text-center">×${item.quantity}</td>
                  <td class="text-right">$${Number(item.item_price || 0).toFixed(2)}</td>
                  <td class="text-right">$${(Number(item.item_price || 0) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('') || '<tr><td colspan="4">No items</td></tr>'}
            </tbody>
          </table>
          <hr class="divider"/>
          <table>
            <tr class="total-row">
              <td>Total</td>
              <td class="text-right">$${Number(selected.total_amount || 0).toFixed(2)}</td>
            </tr>
          </table>
          <p class="pay-method">Payment: ${payMethod.toUpperCase()}</p>
          <hr class="divider"/>
          ${selected.special_requests ? `<p style="font-size:12px;color:#888">📝 ${selected.special_requests}</p><hr class="divider"/>` : ''}
          <p class="footer">Thank you for dining with us! 🙏<br/>RestoHub System</p>
          <button class="print-btn" onclick="window.print()">🖨 Print Receipt</button>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const payMethods = [
    { key: 'cash',   labelAr: 'نقداً',  labelEn: 'Cash',   icon: IconCash       },
    { key: 'card',   labelAr: 'بطاقة',  labelEn: 'Card',   icon: IconCreditCard },
    { key: 'wallet', labelAr: 'محفظة',  labelEn: 'Wallet', icon: IconWallet     },
  ]

  return (
    <div className="flex gap-5 h-full">

      {/* Orders List */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#111110]">
            {isAr ? 'الطلبات غير المدفوعة' : 'Unpaid Orders'}
          </h2>
          <span className="text-xs bg-[#FBF0EB] text-[#D95F2B] px-2.5 py-1 rounded-full font-medium">
            {orders.length}
          </span>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E5E3DE] p-4 h-20 animate-pulse">
                <div className="h-4 bg-[#EDEBE6] rounded w-16 mb-2"></div>
                <div className="h-3 bg-[#EDEBE6] rounded w-24"></div>
              </div>
            ))
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <IconReceipt size={36} className="text-[#E5E3DE]" />
              <p className="text-sm text-[#8A8785]">
                {isAr ? 'لا توجد طلبات' : 'No unpaid orders'}
              </p>
            </div>
          ) : orders.map(order => (
            <div key={order.id}
              onClick={() => handleSelect(order)}
              className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                selected?.id === order.id
                  ? 'border-[#D95F2B] bg-[#FBF0EB]/30'
                  : 'border-[#E5E3DE]'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-[#111110]">#{order.id}</p>
                <p className="font-semibold text-[#D95F2B]">
                  ${Number(order.total_amount || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#8A8785]">
                  {isAr ? 'طاولة' : 'Table'} {order.table_id}
                </p>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                  {isAr ? 'جاهز' : 'Ready'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Panel */}
      <div className="flex-1 flex flex-col gap-4">
        {selected ? (
          <>
            {/* Order Details */}
            <div className="bg-white rounded-xl border border-[#E5E3DE] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E3DE] flex items-center justify-between">
                <h3 className="font-semibold text-[#111110]">
                  {isAr ? 'تفاصيل الطلب' : 'Order Details'} #{selected.id}
                </h3>
                <span className="text-sm text-[#8A8785]">
                  {isAr ? 'طاولة' : 'Table'} {selected.table_id}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F7F4] text-[#8A8785] text-xs uppercase">
                      <th className="px-5 py-3 text-start">{isAr ? 'الصنف' : 'Item'}</th>
                      <th className="px-5 py-3 text-center">{isAr ? 'الكمية' : 'Qty'}</th>
                      <th className="px-5 py-3 text-end">{isAr ? 'السعر' : 'Unit Price'}</th>
                      <th className="px-5 py-3 text-end">{isAr ? 'المجموع' : 'Total'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items?.map((item, i) => (
                      <tr key={i} className="border-t border-[#E5E3DE] hover:bg-[#F8F7F4]">
                        <td className="px-5 py-3 text-[#111110]">
                          {item.menu_item?.name || `Item #${item.menu_item_id}`}
                        </td>
                        <td className="px-5 py-3 text-center text-[#4A4845]">{item.quantity}</td>
                        <td className="px-5 py-3 text-end text-[#4A4845]">
                          ${Number(item.item_price || 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-3 text-end font-medium text-[#111110]">
                          ${(Number(item.item_price || 0) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selected.special_requests && (
                <div className="px-5 py-3 border-t border-[#E5E3DE] bg-[#FBF0EB]">
                  <p className="text-xs text-[#D95F2B]">📝 {selected.special_requests}</p>
                </div>
              )}
              <div className="px-5 py-4 border-t border-[#E5E3DE] flex justify-between items-center">
                <span className="font-medium text-[#4A4845]">
                  {isAr ? 'المجموع الكلي' : 'Total Amount'}
                </span>
                <span className="text-2xl font-semibold text-[#111110]">
                  ${Number(selected.total_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-[#E5E3DE] p-5 flex flex-col gap-4">
              <h3 className="font-semibold text-[#111110]">
                {isAr ? 'طريقة الدفع' : 'Payment Method'}
              </h3>
              <div className="flex gap-3">
                {payMethods.map(m => (
                  <button key={m.key}
                    onClick={() => setPayMethod(m.key)}
                    className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                      payMethod === m.key
                        ? 'border-[#D95F2B] bg-[#FBF0EB] text-[#D95F2B]'
                        : 'border-[#E5E3DE] text-[#8A8785] hover:border-[#D95F2B]/50'
                    }`}>
                    <m.icon size={24} />
                    <span className="text-sm font-medium">{isAr ? m.labelAr : m.labelEn}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E5E3DE] text-sm font-medium text-[#4A4845] hover:border-[#D95F2B] hover:text-[#D95F2B] transition-colors">
                  <IconPrinter size={18} />
                  {isAr ? 'طباعة' : 'Print'}
                </button>
                <button onClick={handlePay} disabled={paying}
                  className="flex-1 bg-[#D95F2B] hover:bg-[#C04E1F] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                  {paying
                    ? (isAr ? 'جاري الدفع...' : 'Processing...')
                    : `${isAr ? 'تأكيد الدفع' : 'Confirm Payment'} — $${Number(selected.total_amount || 0).toFixed(2)}`
                  }
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-[#E5E3DE]">
            <IconReceipt size={48} className="text-[#E5E3DE]" />
            <p className="text-[#8A8785]">
              {isAr ? 'اختر طلباً من القائمة لمعالجة الدفع' : 'Select an order to process payment'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CashierOrders