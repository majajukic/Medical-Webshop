import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'

export const getKorisnici = async (token) => {
  const authConfig = bearerConfig(token)
  const data = await api.getKorisnici(authConfig)
  return data
}

export const getProfil = async (token) => {
  const authConfig = bearerConfig(token)
  const data = await api.getProfil(authConfig)
  return data
}

export const createKorisnik = async (token, newUser) => {
  const authConfig = bearerConfig(token)
  const data = await api.createKorisnik(newUser, authConfig)
  return data
}

export const updateKorisnik = async (token, updatedUser) => {
  const authConfig = bearerConfig(token)
  const response = await api.updateKorisnik(updatedUser, authConfig)
  return response
}

export const deleteKorisnik = async (id, token) => {
  const authConfig = bearerConfig(token)
  await api.deleteKorisnik(id, authConfig)
}
