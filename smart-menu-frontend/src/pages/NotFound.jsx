import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconToolsKitchen2 } from '@tabler/icons-react'

function NotFound() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center gap-6">
      <div className="bg-[#FBF0EB] p-5 rounded-2xl">
        <IconToolsKitchen2 size={48} className="text-[#D95F2B]" />
      </div>
      <div className="text-center">
        <p className="text-8xl font-semibold text-[#EDEBE6]">404</p>
        <h1 className="text-2xl font-semibold text-[#111110] mt-2">
          {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-[#8A8785] mt-1 text-sm">
          {isAr ? 'الرابط الذي تبحث عنه غير موجود' : "The page you're looking for doesn't exist"}
        </p>
      </div>
      <button onClick={() => navigate(-1)}
        className="bg-[#D95F2B] hover:bg-[#C04E1F] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
        {isAr ? 'العودة' : 'Go Back'}
      </button>
    </div>
  )
}

export default NotFound