import React, { createContext, useReducer, useContext } from 'react'
import proizvodReducer from '../reducers/proizvodReducer'

const initialState = {
  proizvodi: []
}

const ProizvodContext = createContext()

export const ProizvodProvider = ({ children }) => {
  const [state, dispatch] = useReducer(proizvodReducer, initialState)

  return (
    <ProizvodContext.Provider value={{ state, dispatch }}>
      {children}
    </ProizvodContext.Provider>
  )
}

export const useProizvod = () => useContext(ProizvodContext)