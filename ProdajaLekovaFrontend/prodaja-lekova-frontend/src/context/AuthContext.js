import { createContext, useReducer, useContext, useMemo } from 'react'
import authReducer from '../reducers/authReducer'

const initialState = {
  token: sessionStorage.getItem('token') || null,
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
