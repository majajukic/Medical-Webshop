import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'

export const getProizvodi = async () => {
  try {
    const data = await api.getProizvodi()

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getTipoviProizvoda = async () => {
  try {
    const data = await api.getTipoviProizvoda()

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiHomePage = async (pageNumber) => {
  try {
    const data = await api.getProizvodiHomePage(pageNumber)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiBySearch = async (searchTerm) => {
  try {
    const data = await api.getProizvodiBySearch(searchTerm)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiByTip = async (type, pageNumber) => {
  try {
    const data = await api.getProizvodiByTip(pageNumber, type)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiByTipCount = async (type) => {
  try {
    const total = await api.getProizvodiByTipCount(type)

    return total
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiBySearchCount = async (searchTerm) => {
  try {

    const total = await api.getProizvodiBySearchCount(searchTerm)

    return total

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiByDiscountCount = async () => {
  try {

    const total = await api.getProizvodiByDiscountCount()

    return total

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiByApoteka = async (pharmacy, pageNumber) => {
  try {
    const data = await api.getProizvodiByApoteka(pharmacy, pageNumber)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodByApoteka = async (pharmacyId) => {
  try {
    const data = await api.getProizvodByApoteka(pharmacyId)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiCenaRastuce = async (pageNumber) => {
  try {
    const data = await api.getProizvodiCenaRastuce(pageNumber)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiPopust = async (pageNumber) => {
  try {
    const data = await api.getProizvodiPopust(pageNumber)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiCenaOpadajuce = async (pageNumber) => {
  try {
    const data = await api.getProizvodiCenaOpadajuce(pageNumber)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodById = async (token, id) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.getProizvodById(id, authConfig)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiCountByApoteka = async (pharmacy) => {
  try {
    const total = await api.getProizvodiCountByApoteka(pharmacy)

    return total
  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiCount = async () => {
  try {
    const total = await api.getProizvodiCount()

    return total
  } catch (error) {
    return error.response.status
  }
}

export const createProizvod = async (token, newProduct) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.createProizvod(newProduct, authConfig)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const addProizvodToApoteka = async (token, newProduct) => {
  try {
    const authConfig = bearerConfig(token)

    const data = await api.addProizvodToApoteka(newProduct, authConfig)

    return data
  } catch (error) {
    return error.response.status
  }
}

export const updateProizvod = async (token, updatedProduct) => {
  try {
    const authConfig = bearerConfig(token)

    const response = await api.updateProizvod(updatedProduct, authConfig)

    return response
  } catch (error) {
    return error.response.status
  }
}

export const updateProizvodInApoteka = async (token, updatedProduct) => {
  try {
    const authConfig = bearerConfig(token)

    const response = await api.updateProizvodInApoteka(
      updatedProduct,
      authConfig,
    )

    return response
  } catch (error) {
    return error.response.status
  }
}

export const deleteProizvod = async (id, token) => {
  try {
    const authConfig = bearerConfig(token)

    await api.deleteProizvod(id, authConfig)
  } catch (error) {
    return error.response.status
  }
}

export const deleteProizvodFromApoteka = async (id, token) => {
  try {
    const authConfig = bearerConfig(token)

    await api.deleteProizvodFromApoteka(id, authConfig)
  } catch (error) {
    return error.response.status
  }
}
