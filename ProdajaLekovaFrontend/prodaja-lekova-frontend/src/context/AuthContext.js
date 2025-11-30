import { createContext, useReducer, useContext } from 'react'
import authReducer from '../reducers/authReducer'

const initialState = {
  token: sessionStorage.getItem('token') || null,
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
