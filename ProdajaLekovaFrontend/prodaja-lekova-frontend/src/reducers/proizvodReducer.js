import {
  DELETE_PRODUCT,
  GET_PRODUCTS,
  GET_PRODUCTS_ASCENDING,
  GET_PRODUCTS_DESCENDING,
  GET_PRODUCTS_DISCOUNT,
  GET_PRODUCTS_BY_SEARCH,
  GET_PRODUCTS_BY_TYPE,
  GET_PRODUCTS_BY_PHARMACY,
  ADD_PRODUCT_TO_PHARMACY,
} from '../constants/actionTypes'

const proizvodReducer = (state, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        proizvodi: action.payload,
      }
    case GET_PRODUCTS_ASCENDING:
      return {
        ...state,
        proizvodi: action.payload,
      }
    case GET_PRODUCTS_DESCENDING:
      return {
        ...state,
        proizvodi: action.payload,
      }
    case GET_PRODUCTS_DISCOUNT:
      return {
        ...state,
        proizvodi: action.payload,
      }
    case GET_PRODUCTS_BY_SEARCH:
      return {
        ...state,
        proizvodi: action.payload,
      }
    case GET_PRODUCTS_BY_TYPE:
      return {
        ...state,
        proizvodi: action.payload,
      }
    case GET_PRODUCTS_BY_PHARMACY:
      return {
        ...state,
        proizvodi: action.payload,
      }
    case ADD_PRODUCT_TO_PHARMACY:
      return {
        ...state,
        proizvodi: [...state.proizvodi, action.payload],
      }
    case DELETE_PRODUCT:
      return {
        ...state,
        proizvodi: state.proizvodi.filter(
          (proizvod) => proizvod.apotekaProizvodId !== action.payload,
        ),
      }
    default:
      return state
  }
}

export default proizvodReducer
