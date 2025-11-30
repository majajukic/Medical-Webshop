import { createContext, useReducer, useContext, useMemo } from 'react'
import proizvodReducer from '../reducers/proizvodReducer'

const initialState = {
  proizvodi: []
}

const ProizvodContext = createContext()

export const ProizvodProvider = ({ children }) => {
  const [state, dispatch] = useReducer(proizvodReducer, initialState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <ProizvodContext.Provider value={value}>
      {children}
    </ProizvodContext.Provider>
  )
}

export const useProizvod = () => useContext(ProizvodContext)