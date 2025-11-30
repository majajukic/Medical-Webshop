import { createContext, useReducer, useContext, useMemo } from 'react'
import korpaReducer from '../reducers/korpaReducer'


const initialState = {
  porudzbina: {}
}

const KorpaContext = createContext()

export const KorpaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(korpaReducer, initialState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <KorpaContext.Provider value={value}>
      {children}
    </KorpaContext.Provider>
  )
}

export const useKorpa = () => useContext(KorpaContext)