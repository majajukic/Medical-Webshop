import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities';

export const getPorudzbine = async (token) => {
    try {
  
      const authConfig = bearerConfig(token);
  
      const data = await api.getPorudzbine(authConfig);
  
      return data
  
    } catch (error) {
      return error.response.status
    }
}

export const getPorudzbineByKupac = async (token) => {
    try {
  
      const authConfig = bearerConfig(token);
  
      const data = await api.getPorudzbineByKupac(authConfig);
  
      return data
  
    } catch (error) {
      return error.response.status
    }
}