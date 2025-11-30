import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'

export const getApoteke = async () => {
  const data = await api.getApoteke()
  return data
}

export const createApoteka = async (token, newPharmacy) => {
  const authConfig = bearerConfig(token)
  const data = await api.createApoteka(newPharmacy, authConfig)
  return data
}

export const updateApoteka = async (token, updatedPharmacy) => {
  const authConfig = bearerConfig(token)
  const response = await api.updateApoteka(updatedPharmacy, authConfig)
  return response
}

export const deleteApoteka = async (id, token) => {
  const authConfig = bearerConfig(token)
  await api.deleteApoteka(id, authConfig)
}
