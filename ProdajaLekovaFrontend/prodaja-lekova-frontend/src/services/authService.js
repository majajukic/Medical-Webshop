import * as api from './api'
import { handleServiceError } from './serviceErrorHandler'

export const login = async (formData) => {
  return handleServiceError(async () => {
    const data = await api.login(formData)

    return data
  })
}

export const register = async (formData) => {
  return handleServiceError(async () => {
    await api.register(formData)
  })
}
