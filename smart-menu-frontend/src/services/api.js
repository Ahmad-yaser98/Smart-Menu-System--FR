import axios from 'axios';

// إعداد كائن axios مع الإعدادات الافتراضية
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`, // رابط سيرفر Laravel الخاص بك
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // withCredentials: true, // تفعيلها في حال أردنا استخدام كوكيز Sanctum بدلاً من التوكن (Bearer Token)
});

// Interceptor للطلبات (Requests): لإضافة التوكن لكل طلب يتم إرساله للباك إند
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // إرفاق التوكن في الـ Headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor للاستجابات (Responses): لمعالجة أخطاء المصادقة عالمياً (مثل انتهاء صلاحية التوكن)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // تفريغ بيانات المستخدم وإعادة توجيهه لصفحة الدخول في حال لم يكن مصرحاً له
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
