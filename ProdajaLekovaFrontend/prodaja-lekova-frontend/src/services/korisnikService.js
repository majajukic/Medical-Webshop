import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities';

export const getKorisnici = async (token) => {
  try {

    const authConfig = bearerConfig(token);

    const data = await api.getKorisnici(authConfig);

    return data

  } catch (error) {
    return error.response.status
  }
}

export const getProfil = async (token) => {
  try {

    const authConfig = bearerConfig(token);

    const data = await api.getProfil(authConfig);

    return data

  } catch (error) {
    return error.response.status
  }
}