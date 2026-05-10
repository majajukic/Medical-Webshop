import { createContext, useReducer, useContext, useMemo } from 'react'
import paginationReducer from '../reducers/PaginationReducer'

const PaginationContext = createContext()

const initialState = {
  currentPage: 1,
  totalRecords: 0,
  pageSize: 9
}

export const PaginationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paginationReducer, initialState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  )
}

export const usePagination = () => useContext(PaginationContext)
