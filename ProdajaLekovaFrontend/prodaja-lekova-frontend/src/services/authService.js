import * as api from './api'

export const login = async (formData) => {
  try {
    const data = await api.login(formData)

    return data

  } catch (error) {
    
    return error.response.status
  }
}

export const register = async (formData) => {
  try {

    await api.register(formData)

  } catch (error) {

    return error.response.status
  }
}
