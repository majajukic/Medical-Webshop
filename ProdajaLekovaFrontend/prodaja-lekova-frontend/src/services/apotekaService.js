import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'
import { handleServiceError } from './serviceErrorHandler'

export const getApoteke = async () => {
  return handleServiceError(async () => {
    const data = await api.getApoteke()

    return data
  })
}

export const createApoteka = async (token, newPharmacy) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.createApoteka(newPharmacy, authConfig)

    return data
  })
}

export const updateApoteka = async (token, updatedPharmacy) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const response = await api.updateApoteka(updatedPharmacy, authConfig)

    return response
  })
}

export const deleteApoteka = async (id, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    await api.deleteApoteka(id, authConfig)
  })
}
