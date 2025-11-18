import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'
import { handleServiceError } from './serviceErrorHandler'

export const getPorudzbine = async (token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.getPorudzbine(authConfig)

    return data
  })
}

export const getPorudzbineByKupac = async (token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.getPorudzbineByKupac(authConfig)

    return data
  })
}

export const getKorpa = async (token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.getKorpa(authConfig)

    return data
  })
}

export const getStavkePorudzbine = async (id, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.getStavkePorudzbine(id, authConfig)

    return data
  })
}

export const getStripeSessionId = async (total) => {
  return handleServiceError(async () => {
    const data = await api.getStripeSessionId(total)

    return data
  })
}

export const createPorudzbina = async (newOrder, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.createPorudzbina(newOrder, authConfig)

    return data
  })
}

export const addStavkaToPorudzbina = async (itemToAdd, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.addStavkaToPorudzbina(itemToAdd, authConfig)

    return data
  })
}

export const deletePorudzbina = async (id, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    await api.deletePorudzbina(id, authConfig)
  })
}

export const deleteStavka = async (id, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    await api.deleteStavka(id, authConfig)
  })
}
