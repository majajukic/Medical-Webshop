import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities';

export const getProizvodi = async () => {
  try {
    const data = await api.getProizvodi();

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getTipoviProizvoda = async () => {
  try {
    const data = await api.getTipoviProizvoda();

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiHomePage = async () => {
  try {
    const data = await api.getProizvodiHomePage();

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiBySearch = async (searchTerm) => {
  try {
    const data = await api.getProizvodiBySearch(searchTerm);

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiByTip = async (type) => {
  try {
    const data = await api.getProizvodiByTip(type);

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiByApoteka = async (pharmacy) => {
  try {
    const data = await api.getProizvodiByApoteka(pharmacy);

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiCenaRastuce = async () => {
  try {
    const data = await api.getProizvodiCenaRastuce();

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiPopust = async () => {
  try {
    const data = await api.getProizvodiPopust();

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getProizvodiCenaOpadajuce = async () => {
  try {
    const data = await api.getProizvodiCenaOpadajuce();

    return data

  } catch (error) {
    return error.response.status
  }
}

export const deleteProizvod = async (id, token) => {
  try {

    const authConfig = bearerConfig(token);

    await api.deleteProizvod(id, authConfig);

  } catch (error) {
    return error.response.status
  }
}

