import * as api from './api'
import { bearerConfig } from '../utilities/authUtilities';

export const getApoteke = async () => {
  try {
    const data = await api.getApoteke();

    return data

  } catch (error) {
    return error.response.status
  }
}

export const deleteApoteka = async (id, token) => {
  try {

    const authConfig = bearerConfig(token);

    await api.deleteApoteka(id, authConfig);

  } catch (error) {
    return error.response.status
  }
}
