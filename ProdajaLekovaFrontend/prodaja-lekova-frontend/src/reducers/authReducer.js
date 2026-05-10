import { LOGIN, LOGOUT } from '../constants/actionTypes'

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
      }
    case LOGOUT:
      localStorage.clear()
      return {
        ...state,
        token: null,
      }
    default:
      return state
  }
}

export default authReducer
