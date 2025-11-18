import React, { Fragment, useEffect, useCallback, useMemo, memo } from 'react'
import ProductCard from './ProductCard'
import ProductCategories from './ProductCategories'
import ProductSorting from './ProductSorting'
import ProductSearch from './ProductSearch'
import { Container, Grid, Typography, Pagination } from '@mui/material'
import { useProizvod } from '../../context/ProizvodContext'
import {
  getProizvodiHomePage,
  getProizvodiCountByApoteka,
  getProizvodiCount,
  getProizvodiByApoteka,
  getProizvodiCenaRastuce,
  getProizvodiCenaOpadajuce,
  getProizvodiPopust,
  getProizvodiByTip,
} from '../../services/proizvodService'
import {
  GET_PRODUCTS,
  GET_PRODUCTS_BY_PHARMACY,
  GET_PRODUCTS_ASCENDING,
  GET_PRODUCTS_DESCENDING,
  GET_PRODUCTS_DISCOUNT,
  GET_PRODUCTS_BY_SEARCH,
} from '../../constants/actionTypes'
import { useParams, useLocation } from 'react-router-dom'
import { usePagination } from '../../context/PaginationContext'

const ProductsPage = () => {
  const { state: proizvodiState, dispatch: proizvodiDispatch } = useProizvod()
  const {
    state: paginationState,
    dispatch: paginationDispatch,
  } = usePagination()
  const { apotekaId } = useParams()
  const { kategorijaId } = useParams()
  const { terminPretrage } = useParams()
  const location = useLocation()

  const handlePageChange = useCallback(
    (event, page) => {
      const totalRecords = paginationState.totalRecords
      const pageSize = paginationState.pageSize
      const maxPage = Math.ceil(totalRecords / pageSize)

      if (totalRecords <= pageSize) {
        paginationDispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })
      } else if (page > 0 && page <= maxPage) {
        paginationDispatch({ type: 'SET_CURRENT_PAGE', payload: page })
      }
    },
    [paginationState.totalRecords, paginationState.pageSize, paginationDispatch],
  )

  const pageCount = useMemo(
    () => Math.ceil(paginationState.totalRecords / paginationState.pageSize),
    [paginationState.totalRecords, paginationState.pageSize]
  )

  useEffect(() => {
    if (
      !apotekaId &&
      !kategorijaId &&
      !terminPretrage &&
      location.pathname !== '/proizvodi/cenaRastuce' &&
      location.pathname !== '/proizvodi/cenaOpadajuce' &&
      location.pathname !== '/proizvodi/naPopustu'
    ) {
      getProizvodiHomePage(paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({ type: GET_PRODUCTS, payload: response.data })
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (apotekaId) {
      getProizvodiByApoteka(apotekaId, paginationState.currentPage).then(
        (response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_BY_PHARMACY,
            payload: response.data,
          })
        },
      )
    } else if (location.pathname === '/proizvodi/cenaRastuce') {
      getProizvodiCenaRastuce(paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_ASCENDING,
            payload: response.data,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (location.pathname === '/proizvodi/cenaOpadajuce') {
      getProizvodiCenaOpadajuce(paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_DESCENDING,
            payload: response.data,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (location.pathname === '/proizvodi/naPopustu') {
      getProizvodiPopust(paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_DISCOUNT,
            payload: response.data,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (kategorijaId) {
      getProizvodiByTip(kategorijaId, paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_BY_SEARCH,
            payload: response.data,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [
    apotekaId,
    kategorijaId,
    terminPretrage,
    location.pathname,
    proizvodiDispatch,
    paginationState.currentPage,
  ])

  useEffect(() => {
    if (apotekaId) {
      getProizvodiCountByApoteka(apotekaId)
        .then((response) => {
          paginationDispatch({
            type: 'SET_TOTAL_RECORDS',
            payload: response.data,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (
      !apotekaId &&
      !kategorijaId &&
      !terminPretrage &&
      location.pathname !== '/proizvodi/cenaRastuce' &&
      location.pathname !== '/proizvodi/cenaOpadajuce' &&
      location.pathname !== '/proizvodi/naPopustu'
    ) {
      getProizvodiCount()
        .then((response) => {
          paginationDispatch({
            type: 'SET_TOTAL_RECORDS',
            payload: response.data,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [
    apotekaId,
    kategorijaId,
    terminPretrage,
    location.pathname,
    paginationDispatch,
  ])

  return (
    <Fragment>
      <ProductCategories />
      <ProductSorting />
      <ProductSearch />
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={18} sx={{ marginTop: 4, marginBottom: 2 }}>
          {proizvodiState.proizvodi.length > 0 ? (
            proizvodiState.proizvodi.map((proizvod) => (
              <Grid key={proizvod.apotekaProizvodId} item xs={12} sm={6} md={4}>
                <ProductCard proizvodProp={proizvod} />
              </Grid>
            ))
          ) : (
            <Typography sx={{ marginTop: '150px' }}>
              Trenutno nema proizvoda
            </Typography>
          )}
        </Grid>
        <Pagination
          sx={{ marginTop: '30px' }}
          count={pageCount}
          page={paginationState.currentPage}
          onChange={handlePageChange}
        />
      </Container>
    </Fragment>
  )
}

export default memo(ProductsPage)
