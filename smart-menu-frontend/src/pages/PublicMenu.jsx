import { useState, useEffect } from 'react'
import { IconToolsKitchen2, IconSearch } from '@tabler/icons-react'
import API from '../services/authService'

export default function PublicMenu() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          API.get('/categories'),
          API.get('/menu-items'),
        ])
        setCategories(catRes.data.data || catRes.data || [])
        setItems((itemRes.data.data || itemRes.data || []).filter(i => i.is_available))
      } catch (err) {
        console.error("Error fetching menu data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = items.filter(item => {
    return selectedCat === 'all' || item.category_id == selectedCat
  })

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* Header */}
      <div className="bg-[#1E1410] px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-[#D95F2B] rounded-xl flex items-center justify-center">
            <IconToolsKitchen2 size={22} color="white" />
          </div>
          <h1 className="text-white text-2xl font-semibold">RestoHub</h1>
        </div>
        <p className="text-[#F0E8E0] text-sm opacity-70">قائمة الطعام — Menu</p>
      </div>

      {/* Categories & Items Layout */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Categories Panel (Sidebar) */}
        <div className="w-56 hidden md:flex flex-col gap-2 sticky top-[104px] self-start">
          <p className="text-xs font-medium text-[#8A8785] uppercase tracking-wide mb-1">
            الأصناف / Categories
          </p>
          <button
            onClick={() => setSelectedCat('all')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCat === 'all'
                ? 'bg-[#FBF0EB] text-[#D95F2B] border-s-2 border-[#D95F2B]'
                : 'text-[#4A4845] hover:bg-white border-transparent'
            }`}>
            <span>الكل / All</span>
            <span className="text-xs bg-white border border-[#E5E3DE] px-2 py-0.5 rounded-full">{items.length}</span>
          </button>
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCat === cat.id
                  ? 'bg-[#FBF0EB] text-[#D95F2B] border-s-2 border-[#D95F2B]'
                  : 'text-[#4A4845] hover:bg-white border-transparent'
              }`}>
              <span>{cat.name}</span>
              <span className="text-xs bg-white border border-[#E5E3DE] px-2 py-0.5 rounded-full">
                {items.filter(i => i.category_id === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Categories (Horizontal Scroll) */}
        <div className="md:hidden flex gap-2 w-full overflow-x-auto pb-4 mb-2">
          <button onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              selectedCat === 'all'
                ? 'bg-[#D95F2B] text-white'
                : 'bg-white text-[#4A4845] border border-[#E5E3DE]'
            }`}>
            الكل / All
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCat === cat.id
                  ? 'bg-[#D95F2B] text-white'
                  : 'bg-white text-[#4A4845] border border-[#E5E3DE]'
              }`}>
              {cat.name}
            </button>
          ))}
        </div>
        
        {/* Items Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 h-32 animate-pulse border border-[#E5E3DE]">
                  <div className="h-4 bg-[#EDEBE6] rounded w-32 mb-2"></div>
                  <div className="h-3 bg-[#EDEBE6] rounded w-16 mb-4"></div>
                  <div className="h-6 bg-[#EDEBE6] rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[#8A8785]">
              لا توجد نتائج / No results found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => (
                <div key={item.id}
                  className="bg-white rounded-xl border border-[#E5E3DE] p-4 flex flex-col justify-between hover:border-[#D95F2B] transition-all hover:shadow-sm">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-[#111110] text-sm">{item.name}</p>
                      <p className="font-bold text-[#111110] text-sm">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    {item.description && (
                      <p className="text-xs text-[#8A8785] mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-[11px] font-medium text-[#D95F2B] bg-[#FBF0EB] px-2.5 py-1 rounded-full">
                      {categories.find(c => c.id === item.category_id)?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-xs text-[#8A8785]">
        <p>Powered by AYSTech </p>
      </div>
    </div>
  )
}