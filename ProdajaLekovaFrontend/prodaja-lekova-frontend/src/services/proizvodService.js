import * as api from './api'

export const getProizvodi = async () => {
  try {
    const data = await api.getProizvodi();

    return data

  } catch (error) {
    return error.response.status
  }
}