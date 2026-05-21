import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/authService'

export function useAutoLogout() {
  const navigate = useNavigate()

  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          localStorage.clear()
          navigate('/')
        }
        return Promise.reject(err)
      }
    )
    return () => API.interceptors.response.eject(interceptor)
  }, [navigate])
}