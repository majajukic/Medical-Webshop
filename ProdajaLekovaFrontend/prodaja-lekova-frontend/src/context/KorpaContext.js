import React, { createContext, useReducer, useContext } from 'react'
import korpaReducer from '../reducers/korpaReducer'


const initialState = {
  porudzbina: {}
}

const KorpaContext = createContext()

export const KorpaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(korpaReducer, initialState)

  return (
    <KorpaContext.Provider value={{ state, dispatch }}>
      {children}
    </KorpaContext.Provider>
  )
}

export const useKorpa = () => useContext(KorpaContext)