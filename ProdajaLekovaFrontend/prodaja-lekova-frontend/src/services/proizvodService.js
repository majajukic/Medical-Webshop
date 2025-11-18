import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities'
import { handleServiceError } from './serviceErrorHandler'

export const getProizvodi = async () => {
  return handleServiceError(async () => {
    const data = await api.getProizvodi()

    return data
  })
}

export const getTipoviProizvoda = async () => {
  return handleServiceError(async () => {
    const data = await api.getTipoviProizvoda()

    return data
  })
}

export const getProizvodiHomePage = async (pageNumber) => {
  return handleServiceError(async () => {
    const data = await api.getProizvodiHomePage(pageNumber)

    return data
  })
}

export const getProizvodiBySearch = async (searchTerm) => {
  return handleServiceError(async () => {
    const data = await api.getProizvodiBySearch(searchTerm)

    return data
  })
}

export const getProizvodiByTip = async (type, pageNumber) => {
  return handleServiceError(async () => {
    const data = await api.getProizvodiByTip(pageNumber, type)

    return data
  })
}

export const getProizvodiByTipCount = async (type) => {
  return handleServiceError(async () => {
    const total = await api.getProizvodiByTipCount(type)

    return total
  })
}

export const getProizvodiBySearchCount = async (searchTerm) => {
  return handleServiceError(async () => {
    const total = await api.getProizvodiBySearchCount(searchTerm)

    return total
  })
}

export const getProizvodiByDiscountCount = async () => {
  return handleServiceError(async () => {
    const total = await api.getProizvodiByDiscountCount()

    return total
  })
}

export const getProizvodiByApoteka = async (pharmacy, pageNumber) => {
  return handleServiceError(async () => {
    const data = await api.getProizvodiByApoteka(pharmacy, pageNumber)

    return data
  })
}

export const getProizvodByApoteka = async (pharmacyId) => {
  return handleServiceError(async () => {
    const data = await api.getProizvodByApoteka(pharmacyId)

    return data
  })
}

export const getProizvodiCenaRastuce = async (pageNumber) => {
  return handleServiceError(async () => {
    const data = await api.getProizvodiCenaRastuce(pageNumber)

    return data
  })
}

export const getProizvodiPopust = async (pageNumber) => {
  return handleServiceError(async () => {
    const data = await api.getProizvodiPopust(pageNumber)

    return data
  })
}

export const getProizvodiCenaOpadajuce = async (pageNumber) => {
  return handleServiceError(async () => {
    const data = await api.getProizvodiCenaOpadajuce(pageNumber)

    return data
  })
}

export const getProizvodById = async (token, id) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.getProizvodById(id, authConfig)

    return data
  })
}

export const getProizvodiCountByApoteka = async (pharmacy) => {
  return handleServiceError(async () => {
    const total = await api.getProizvodiCountByApoteka(pharmacy)

    return total
  })
}

export const getProizvodiCount = async () => {
  return handleServiceError(async () => {
    const total = await api.getProizvodiCount()

    return total
  })
}

export const createProizvod = async (token, newProduct) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.createProizvod(newProduct, authConfig)

    return data
  })
}

export const addProizvodToApoteka = async (token, newProduct) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const data = await api.addProizvodToApoteka(newProduct, authConfig)

    return data
  })
}

export const updateProizvod = async (token, updatedProduct) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const response = await api.updateProizvod(updatedProduct, authConfig)

    return response
  })
}

export const updateProizvodInApoteka = async (token, updatedProduct) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    const response = await api.updateProizvodInApoteka(
      updatedProduct,
      authConfig,
    )

    return response
  })
}

export const deleteProizvod = async (id, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    await api.deleteProizvod(id, authConfig)
  })
}

export const deleteProizvodFromApoteka = async (id, token) => {
  return handleServiceError(async () => {
    const authConfig = bearerConfig(token)

    await api.deleteProizvodFromApoteka(id, authConfig)
  })
}
