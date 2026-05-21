import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ar: {
    translation: {
      dashboard: 'لوحة التحكم',
      tables: 'الطاولات',
      menu: 'القائمة',
      staff: 'الموظفون',
      orders: 'الطلبات',
      invoices: 'الفواتير',
      logout: 'تسجيل الخروج',
      welcome_back: 'أهلاً بعودتك',
      sign_in: 'تسجيل الدخول',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      remember_me: 'تذكرني',
      unpaid_orders: 'الطلبات غير المدفوعة',
      order_details: 'تفاصيل الطلب',
      total_amount: 'المجموع الكلي',
      payment_method: 'طريقة الدفع',
      confirm_payment: 'تأكيد الدفع',
      cash: 'نقداً',
      card: 'بطاقة',
      wallet: 'محفظة',
      print: 'طباعة',
      processing: 'جاري الدفع...',
      item: 'الصنف',
      qty: 'الكمية',
      unit_price: 'سعر الوحدة',
      total: 'المجموع',
      table: 'الطاولة',
      no_unpaid_orders: 'لا توجد طلبات غير مدفوعة',
      select_order: 'اختر طلباً لمعالجة الدفع',
      payment_success: 'تم الدفع بنجاح!',
      payment_failed: 'فشل الدفع',
      ready: 'جاهز',
    }
  },
  en: {
    translation: {
      dashboard: 'Dashboard',
      tables: 'Tables',
      menu: 'Menu',
      staff: 'Staff',
      orders: 'Orders',
      invoices: 'Invoices',
      logout: 'Logout',
      welcome_back: 'Welcome Back',
      sign_in: 'Sign In',
      email: 'Email',
      password: 'Password',
      remember_me: 'Remember me',
      unpaid_orders: 'Unpaid Orders',
      order_details: 'Order Details',
      total_amount: 'Total Amount',
      payment_method: 'Payment Method',
      confirm_payment: 'Confirm Payment',
      cash: 'Cash',
      card: 'Card',
      wallet: 'Wallet',
      print: 'Print',
      processing: 'Processing...',
      item: 'Item',
      qty: 'Qty',
      unit_price: 'Unit Price',
      total: 'Total',
      table: 'Table',
      no_unpaid_orders: 'No unpaid orders',
      select_order: 'Select an order to process payment',
      payment_success: 'Payment successful!',
      payment_failed: 'Payment failed',
      ready: 'Ready',
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n