import { createContext, useReducer, useContext, useMemo } from 'react'
import apotekaReducer from '../reducers/apotekaReducer'

const initialState = {
  apoteke: []
}

const ApotekaContext = createContext()

export const ApotekaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apotekaReducer, initialState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <ApotekaContext.Provider value={value}>
      {children}
    </ApotekaContext.Provider>
  )
}

export const useApoteka = () => useContext(ApotekaContext)