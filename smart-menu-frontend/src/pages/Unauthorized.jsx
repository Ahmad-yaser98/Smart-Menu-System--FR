import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconLock } from '@tabler/icons-react'

function Unauthorized() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center gap-6">
      <div className="bg-red-50 p-5 rounded-2xl">
        <IconLock size={48} className="text-red-500" />
      </div>
      <div className="text-center">
        <p className="text-8xl font-semibold text-[#EDEBE6]">403</p>
        <h1 className="text-2xl font-semibold text-[#111110] mt-2">
          {isAr ? 'غير مصرح لك' : 'Access Denied'}
        </h1>
        <p className="text-[#8A8785] mt-1 text-sm">
          {isAr ? 'ليس لديك صلاحية لعرض هذه الصفحة' : "You don't have permission to view this page"}
        </p>
      </div>
      <button onClick={() => navigate(-1)}
        className="bg-[#D95F2B] hover:bg-[#C04E1F] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
        {isAr ? 'العودة' : 'Go Back'}
      </button>
    </div>
  )
}

export default Unauthorized