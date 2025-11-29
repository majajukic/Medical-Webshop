import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'

export const getPorudzbine = async (token) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.getPorudzbine(authConfig)

    return data
  } catch (error) {
    return error.response?.status || 500
  }
}

export const getPorudzbineByKupac = async (token) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.getPorudzbineByKupac(authConfig)

    return data
  } catch (error) {
    return error.response?.status || 500
  }
}

export const getKorpa = async (token) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.getKorpa(authConfig)

    return data
  } catch (error) {
    return error.response?.status || 500
  }
}

export const getStavkePorudzbine = async (id, token) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.getStavkePorudzbine(id, authConfig)

    return data
  } catch (error) {
    return error.response?.status || 500
  }
}

export const getStripeSessionId = async (total) => {
  try {
    const data = await api.getStripeSessionId(total)

    return data
  } catch (error) {
    return error
  }
}

export const createPorudzbina = async (newOrder, token) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.createPorudzbina(newOrder, authConfig)

    return data
  } catch (error) {
    return error.response?.status || 500
  }
}

export const addStavkaToPorudzbina = async (itemToAdd, token) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.addStavkaToPorudzbina(itemToAdd, authConfig)

    return data
  } catch (error) {
    return error.response?.status || 500
  }
}

export const deletePorudzbina = async (id, token) => {
  try {
    const authConfig = bearerConfig(token)

    await api.deletePorudzbina(id, authConfig)
  } catch (error) {
    return error.response?.status || 500
  }
}

export const deleteStavka = async (id, token) => {
  try {
    const authConfig = bearerConfig(token)

    await api.deleteStavka(id, authConfig)
  } catch (error) {
    return error.response?.status || 500
  }
}
