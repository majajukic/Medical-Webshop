import React, { createContext, useReducer, useContext } from 'react'
import paginationReducer from '../reducers/PaginationReducer'

const PaginationContext = createContext()

const initialState = {
  currentPage: 1,
  totalRecords: 0,
  pageSize: 9
}

export const PaginationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paginationReducer, initialState)

  return (
    <PaginationContext.Provider value={{ state, dispatch }}>
      {children}
    </PaginationContext.Provider>
  )
}

export const usePagination = () => useContext(PaginationContext)
