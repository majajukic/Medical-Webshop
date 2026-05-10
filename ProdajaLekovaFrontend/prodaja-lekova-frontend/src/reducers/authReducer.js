import { LOGIN, LOGOUT } from '../constants/actionTypes'

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      sessionStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
      }
    case LOGOUT:
      sessionStorage.clear()
      return {
        ...state,
        token: null,
      }
    default:
      return state
  }
}

export default authReducer
