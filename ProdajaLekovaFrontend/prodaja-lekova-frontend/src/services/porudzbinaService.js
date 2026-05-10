import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'

export const getPorudzbine = async (token) => {
  const authConfig = bearerConfig(token)
  const data = await api.getPorudzbine(authConfig)
  return data
}

export const getPorudzbineByKupac = async (token) => {
  const authConfig = bearerConfig(token)
  const data = await api.getPorudzbineByKupac(authConfig)
  return data
}

export const getKorpa = async (token) => {
  const authConfig = bearerConfig(token)
  const data = await api.getKorpa(authConfig)
  return data
}

export const getStavkePorudzbine = async (id, token) => {
  const authConfig = bearerConfig(token)
  const data = await api.getStavkePorudzbine(id, authConfig)
  return data
}

export const getStripeSessionId = async (total) => {
  const data = await api.getStripeSessionId(total)
  return data
}

export const createPorudzbina = async (newOrder, token) => {
  const authConfig = bearerConfig(token)
  const data = await api.createPorudzbina(newOrder, authConfig)
  return data
}

export const addStavkaToPorudzbina = async (itemToAdd, token) => {
  const authConfig = bearerConfig(token)
  const data = await api.addStavkaToPorudzbina(itemToAdd, authConfig)
  return data
}

export const deletePorudzbina = async (id, token) => {
  const authConfig = bearerConfig(token)
  await api.deletePorudzbina(id, authConfig)
}

export const deleteStavka = async (id, token) => {
  const authConfig = bearerConfig(token)
  await api.deleteStavka(id, authConfig)
}
