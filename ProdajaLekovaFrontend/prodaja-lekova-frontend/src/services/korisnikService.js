import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'

export const getKorisnici = async (token) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.getKorisnici(authConfig)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProfil = async (token) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.getProfil(authConfig)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const createKorisnik = async (token, newUser) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.createKorisnik(newUser, authConfig)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const updateKorisnik = async (token, updatedUser) => {
  try {
    const authConfig = bearerConfig(token)

    const response = await api.updateKorisnik(updatedUser, authConfig)

    return response
  } catch (error) {
    return error.response.status
  }
}

export const deleteKorisnik = async (id, token) => {
  try {
    const authConfig = bearerConfig(token)

    await api.deleteKorisnik(id, authConfig)
  } catch (error) {
    return error.response.status
  }
}
