import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'

export const getApoteke = async () => {
  try {
    const data = await api.getApoteke()

    return data
  } catch (error) {
    return error.response?.status || 500
  }
}

export const createApoteka = async (token, newPharmacy) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.createApoteka(newPharmacy, authConfig)

    return data
  } catch (error) {
    return error.response?.status || 500
  }
}

export const updateApoteka = async (token, updatedPharmacy) => {
  try {
    const authConfig = bearerConfig(token)

    const response = await api.updateApoteka(updatedPharmacy, authConfig)

    return response
  } catch (error) {
    return error.response?.status || 500
  }
}

export const deleteApoteka = async (id, token) => {
  try {
    const authConfig = bearerConfig(token)

    await api.deleteApoteka(id, authConfig)
  } catch (error) {
    return error.response?.status || 500
  }
}
