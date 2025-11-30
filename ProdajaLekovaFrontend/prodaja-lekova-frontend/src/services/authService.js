import * as api from './api'

export const login = async (formData) => {
  const data = await api.login(formData)
  return data
}

export const register = async (formData) => {
  await api.register(formData)
}
