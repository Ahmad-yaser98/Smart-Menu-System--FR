import { useEffect, useRef } from 'react'
import {
  IconToolsKitchen2, IconMapPin, IconPhone, IconMail,
  IconClock, IconArmchair, IconQrcode, IconSalad,
  IconBrandInstagram, IconBrandFacebook, IconBrandTiktok,
  IconChevronDown
} from '@tabler/icons-react'

const menuItems = [
  { name: 'Mixed Grill Platter', desc: 'A generous mix of grilled meats with fresh herbs', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
  { name: 'Crispy Shawarma', desc: 'Slow-roasted with our secret spice blend', img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80' },
  { name: 'Hummus & Pita', desc: 'House-made hummus, warm pita, olive oil drizzle', img: 'https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=400&q=80' },
  { name: 'Grilled Chicken', desc: 'Marinated overnight, charcoal grilled to perfection', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80' },
  { name: 'Fattoush Salad', desc: 'Fresh garden vegetables with crispy bread chips', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { name: 'Knafeh Dessert', desc: 'Traditional cheese pastry with sweet syrup', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80' },
  { name: 'Fresh Juices', desc: 'Seasonal fruits, freshly squeezed daily', img: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&q=80' },
  { name: 'Kebab Skewers', desc: 'Minced meat with onions and parsley, grilled fresh', img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80' },
]

const steps = [
  { icon: IconArmchair,   step: '01', title: 'Grab a Table',    desc: 'Walk in and our team will seat you at the perfect spot.' },
  { icon: IconQrcode,     step: '02', title: 'Scan QR Code',    desc: 'Scan the QR code on your table to browse our smart digital menu.' },
  { icon: IconSalad,      step: '03', title: 'Order & Enjoy',   desc: "Place your order and we'll bring it fresh to your table." },
]

export default function Landing() {
  const menuRef = useRef(null)

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="font-sans text-[#111110]">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-[#E5E3DE]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="RestoHub Logo" className="h-10 w-auto object-contain" />
            <span className="font-semibold text-[#111110]">RestoHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#4A4845]">
            {['Home','About Us','Our Menu','Experience','Contact Us'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(' ','-')}`}
                className="hover:text-[#D95F2B] transition-colors cursor-pointer">
                {link}
              </a>
            ))}
          </div>
          <a href="#contact-us"
            className="border border-[#D95F2B] text-[#D95F2B] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FBF0EB] transition-colors">
            Find Us on Map
          </a>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
          alt="Restaurant"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1E1410]/50"></div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">
            Authentic Taste,<br />Served Smart.
          </h1>
          <p className="text-[#F0E8E0] text-lg mb-8 max-w-xl mx-auto">
            Discover a new dining experience where tradition meets technology.
          </p>
          <button onClick={scrollToMenu}
            className="bg-[#D95F2B] hover:bg-[#C04E1F] text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">
            Explore Our Dishes
            <IconChevronDown size={18} />
          </button>
        </div>
      </section>

      {/* ===== ABOUT US ===== */}
      <section id="about-us" className="bg-[#F8F7F4] py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Images Collage */}
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80"
              alt="Restaurant interior" className="rounded-2xl w-full h-56 object-cover col-span-2" />
            <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&q=80"
              alt="Chef at work" className="rounded-2xl w-full h-40 object-cover" />
            <img src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400&q=80"
              alt="Kitchen" className="rounded-2xl w-full h-40 object-cover" />
          </div>

          {/* Text */}
          <div>
            <p className="text-xs font-medium text-[#8A8785] uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="text-3xl font-semibold text-[#111110] mb-5 leading-snug">
              Passion for Food<br />& Fast Service
            </h2>
            <p className="text-[#4A4845] leading-relaxed mb-6">
              At RestoHub, we believe great food should never keep you waiting.
              Born from a love of authentic Lebanese flavors and a passion for smart service,
              we combine traditional recipes with modern technology to give you a dining
              experience that's both memorable and effortless.
            </p>
            <p className="text-[#4A4845] leading-relaxed mb-8">
              Every dish is prepared fresh daily using locally sourced ingredients.
              Our kitchen team takes pride in delivering consistent quality — from the
              first bite to the last. Cleanliness, speed, and heart are at the core of everything we do.
            </p>
            <div className="flex gap-8">
              {[['10+','Years of Experience'],['50+','Signature Dishes'],['1K+','Happy Customers']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-semibold text-[#D95F2B]">{num}</p>
                  <p className="text-xs text-[#8A8785]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOD SHOWCASE ===== */}
      <section id="our-menu" ref={menuRef} className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#8A8785] uppercase tracking-widest mb-2">What We Serve</p>
            <h2 className="text-3xl font-semibold text-[#111110]">A Taste of Our Menu</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {menuItems.map(item => (
              <div key={item.name}
                className="border border-[#E5E3DE] rounded-xl overflow-hidden group hover:border-[#D95F2B] transition-all hover:shadow-lg cursor-pointer">
                <div className="overflow-hidden h-44">
                  <img src={item.img} alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-[#111110] font-medium text-sm mb-1">{item.name}</p>
                  <p className="text-[#8A8785] text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SMART EXPERIENCE ===== */}
      <section id="experience" className="bg-[#1E1410] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-[#D95F2B] uppercase tracking-widest mb-2">Smart Dining</p>
            <h2 className="text-3xl font-semibold text-white">How to Order When You Visit</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                {s.title === 'Scan QR Code' ? (
                  <div className="relative">
                    <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-sm flex items-center justify-center transition-transform hover:scale-105 cursor-pointer" onClick={() => window.location.href = '/menu'}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/menu')}&color=1E1410`} 
                        alt="Menu QR" className="w-full h-full object-contain" 
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#D95F2B] rounded-full text-white text-xs font-semibold flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#D95F2B]/20 rounded-2xl flex items-center justify-center">
                      <s.icon size={28} className="text-[#D95F2B]" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#D95F2B] rounded-full text-white text-xs font-semibold flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                )}
                <h3 className="text-white font-semibold text-lg">{s.title}</h3>
                <p className="text-[#F0E8E0] text-sm leading-relaxed opacity-80">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact-us" className="bg-[#F8F7F4] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-[#8A8785] uppercase tracking-widest mb-2">Find Us</p>
            <h2 className="text-3xl font-semibold text-[#111110]">Contact & Location</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E5E3DE] h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353!3d-37.8172099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzAyLjAiUyAxNDTCsDU3JzEzLjUiRQ!5e0!3m2!1sen!2s!4v1234567890"
                width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"
                title="Restaurant Location">
              </iframe>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-[#E5E3DE] p-6 flex flex-col gap-5">
                {[
                  { icon: IconPhone, label: 'Phone',         value: '+963 11 234 5678' },
                  { icon: IconMail,  label: 'Email',         value: 'hello@restohub.com' },
                  { icon: IconClock, label: 'Opening Hours', value: 'Open Daily: 12:00 PM – 12:00 AM' },
                  { icon: IconMapPin,label: 'Address',       value: 'Main Street, Downtown, Damascus, Syria' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#FBF0EB] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#D95F2B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8A8785] mb-0.5">{label}</p>
                      <p className="text-[#111110] font-medium text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1E1410] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="RestoHub Logo" className="h-10 w-auto object-contain bg-white rounded-full p-1" />
            <span className="text-white font-semibold">RestoHub</span>
          </div>
          <p className="text-[#F0E8E0] text-xs opacity-50">
            © {new Date().getFullYear()} RestoHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[IconBrandInstagram, IconBrandFacebook, IconBrandTiktok].map((Icon, i) => (
              <a key={i} href="#"
                className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-[#F0E8E0] hover:border-[#D95F2B] hover:text-[#D95F2B] transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}