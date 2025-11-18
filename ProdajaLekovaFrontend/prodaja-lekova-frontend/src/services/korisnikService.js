import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'
import { handleServiceError } from './serviceErrorHandler'

export const getKorisnici = async (token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.getKorisnici(authConfig)

    return data
  })
}

export const getProfil = async (token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.getProfil(authConfig)

    return data
  })
}

export const createKorisnik = async (token, newUser) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.createKorisnik(newUser, authConfig)

    return data
  })
}

export const updateKorisnik = async (token, updatedUser) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const response = await api.updateKorisnik(updatedUser, authConfig)

    return response
  })
}

export const deleteKorisnik = async (id, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    await api.deleteKorisnik(id, authConfig)
  })
}
