import { useEffect, useRef } from 'react'
import { IconDownload, IconPrinter } from '@tabler/icons-react'

export default function QRCodePage() {
  const canvasRef = useRef(null)
  const url = `${window.location.origin}/menu/public`

  useEffect(() => {
    // نستخدم مكتبة QR عبر CDN
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
    script.onload = () => {
      document.getElementById('qrcode').innerHTML = ''
      new window.QRCode(document.getElementById('qrcode'), {
        text: url,
        width: 200,
        height: 200,
        colorDark: '#1E1410',
        colorLight: '#ffffff',
      })
    }
    document.head.appendChild(script)
  }, [])

  const handlePrint = () => window.print()

  const handleDownload = () => {
    const canvas = document.querySelector('#qrcode canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'menu-qr.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="bg-white rounded-2xl border border-[#E5E3DE] p-8 flex flex-col items-center gap-5 shadow-sm">
        <h2 className="font-semibold text-[#111110] text-lg">QR Code — قائمة الطعام</h2>
        <p className="text-xs text-[#8A8785] text-center max-w-xs">
          الزبون بمسح هاد الـ QR بتطلعله قائمة الطعام مباشرة بدون login
        </p>
        <div id="qrcode" className="p-3 border border-[#E5E3DE] rounded-xl"></div>
        <p className="text-xs text-[#D95F2B] bg-[#FBF0EB] px-3 py-1.5 rounded-full font-medium break-all text-center">
          {url}
        </p>
        <div className="flex gap-3">
          <button onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E3DE] text-sm font-medium text-[#4A4845] hover:border-[#D95F2B] hover:text-[#D95F2B] transition-colors">
            <IconDownload size={16} />
            تحميل
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D95F2B] text-white text-sm font-medium hover:bg-[#C04E1F] transition-colors">
            <IconPrinter size={16} />
            طباعة
          </button>
        </div>
      </div>
    </div>
  )
}