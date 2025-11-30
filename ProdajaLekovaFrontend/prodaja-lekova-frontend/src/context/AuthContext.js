import React, { createContext, useReducer, useContext } from 'react'
import authReducer from '../reducers/authReducer'

const initialState = {
  token: localStorage.getItem('token') || null,
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
