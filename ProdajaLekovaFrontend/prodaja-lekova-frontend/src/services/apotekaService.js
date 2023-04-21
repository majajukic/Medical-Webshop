import * as api from './api'

export const getApoteke = async () => {
  try {
    const data = await api.getApoteke();

    return data

  } catch (error) {
    return error.response.status
  }
}
