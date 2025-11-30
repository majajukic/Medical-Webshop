import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = axios.create({ baseURL: 'https://localhost:7156' })

// Global request interceptor
BASE_URL.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error('Request error:', error)
    toast.error('Greška pri slanju zahteva.')
    return Promise.reject(error)
  }
)

// Global response interceptor for error handling
BASE_URL.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data || error.response.data?.detail || error.response.data?.title || 'Interna greška servera'

      switch (status) {
        case 400:
          console.error('Bad request:', message)
          toast.error(typeof message === 'string' ? message : 'Neispravni podaci.')
          break
        case 401:
          console.error('Unauthorized.')
          toast.error('Neautorizovan pristup. Molimo prijavite se.')
          break
        case 403:
          console.error('Forbidden access:', message)
          toast.error('Zabranjen pristup.')
          break
        case 404:
          console.error('Resource not found:', message)
          toast.error(typeof message === 'string' ? message : 'Resurs nije pronađen.')
          break
        case 409:
          console.error('Conflict:', message)
          toast.error(typeof message === 'string' ? message : 'Konflikt podataka.')
          break
        case 500:
          console.error('Internal server error:', message)
          toast.error('Interna greška servera.')
          break
        default:
          console.error('Server error:', message)
          toast.error('Došlo je do greške.')
          break
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error. Please check your internet connection.')
      toast.error('Greška u mreži. Proverite internet konekciju.')
    } else {
      console.error('Error:', error.message)
      toast.error('Došlo je do greške.')
    }

    return Promise.reject(error)
  }
)

export default BASE_URL
