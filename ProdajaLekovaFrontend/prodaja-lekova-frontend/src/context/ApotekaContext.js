import React, { createContext, useReducer, useContext } from 'react'
import apotekaReducer from '../reducers/apotekaReducer'

const initialState = {
  apoteke: []
}

const ApotekaContext = createContext()

export const ApotekaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apotekaReducer, initialState)

  return (
    <ApotekaContext.Provider value={{ state, dispatch }}>
      {children}
    </ApotekaContext.Provider>
  )
}

export const useApoteka = () => useContext(ApotekaContext)