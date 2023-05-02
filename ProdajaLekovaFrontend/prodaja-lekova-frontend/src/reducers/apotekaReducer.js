import {
  CREATE_PHARMACY,
  DELETE_PHARMACY,
  GET_PHARMACIES,
} from '../constants/actionTypes'

const apotekaReducer = (state, action) => {
  switch (action.type) {
    case GET_PHARMACIES:
      return {
        ...state,
        apoteke: action.payload,
      }
    case CREATE_PHARMACY:
      return {
        ...state,
        apoteke: [...state.apoteke, action.payload],
      }
    case DELETE_PHARMACY:
      return {
        ...state,
        apoteke: state.apoteke.filter(
          (apoteka) => apoteka.apotekaId !== action.payload,
        ),
      }
    default:
      return state
  }
}

export default apotekaReducer
