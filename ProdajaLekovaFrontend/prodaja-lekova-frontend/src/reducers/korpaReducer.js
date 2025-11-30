import {
  GET_CART,
  ADD_CART_ITEM,
  UPDATE_CART,
  EMPTY_CART,
  REMOVE_ITEM,
  UPDATE_TOTAL,
} from '../constants/actionTypes'

const korpaReducer = (state, action) => {
  switch (action.type) {
    case GET_CART:
      return {
        ...state,
        porudzbina: action.payload,
      }
    case ADD_CART_ITEM:
      return {
        ...state,
        porudzbina: action.payload,
      }
    case EMPTY_CART:
      return {
        ...state,
        porudzbina: state.initialState,
      }
    case REMOVE_ITEM: {
      const updatedItems = state.porudzbina.stavkaPorudzbine.filter(
        (item) => item.stavkaId !== action.payload,
      )
      return {
        ...state,
        porudzbina: {
          ...state.porudzbina,
          stavkaPorudzbine: updatedItems,
        },
      }
    }
    case UPDATE_CART:
      return {
        ...state,
        porudzbina: action.payload,
      }
    case UPDATE_TOTAL:
      return {
        ...state,
        porudzbina: {
          ...state.porudzbina,
          ukupanIznos: action.payload,
        },
      }
    default:
      return state
  }
}

export default korpaReducer
