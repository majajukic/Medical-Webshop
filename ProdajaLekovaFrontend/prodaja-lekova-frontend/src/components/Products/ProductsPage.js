import React, { Fragment, useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import ProductCategories from './ProductCategories'
import ProductSorting from './ProductSorting'
import ProductSearch from './ProductSearch'
import { Container, Grid, Typography, Pagination } from '@mui/material'
import { useProizvod } from '../../context/ProizvodContext'
import {
  getProizvodiHomePage,
  getProizvodiByApoteka,
  getProizvodiCountByApoteka,
  getProizvodiCount,
} from '../../services/proizvodService'
import { GET_PRODUCTS } from '../../constants/actionTypes'
import { useParams } from 'react-router-dom'
import { usePagination } from '../../context/PaginationContext'

const ProductsPage = () => {
  const { state: proizvodiState, dispatch: proizvodiDispatch } = useProizvod()
  const {
    state: paginationState,
    dispatch: paginationDispatch,
  } = usePagination()
  const { apotekaId } = useParams()

  useEffect(() => {
    console.log('home useeffect')
    if (apotekaId) {
      handlePageChange()
      getProizvodiByApoteka(apotekaId, paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({ type: GET_PRODUCTS, payload: response.data })
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      getProizvodiHomePage(paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({ type: GET_PRODUCTS, payload: response.data })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [
    apotekaId,
    proizvodiDispatch,
    paginationState.currentPage,
    paginationState.totalRecords,
  ])
console.log(paginationState)
  useEffect(() => {
    console.log('count products main')
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
    } else {
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
  }, [apotekaId, proizvodiDispatch, paginationDispatch])

  function handlePageChange(event, page) {
    const totalRecords = paginationState.totalRecords
    const pageSize = paginationState.pageSize
    const maxPage = Math.ceil(totalRecords / pageSize)

    if (totalRecords <= pageSize) {
      paginationDispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })
    } else if (page > 0 && page <= maxPage) {
      paginationDispatch({ type: 'SET_CURRENT_PAGE', payload: page })
    }
  }

  /*const handleUpdateTotalRecords = (newTotal) => {
    console.log(newTotal)
    paginationDispatch({ type: 'SET_TOTAL_RECORDS', payload: newTotal })
  }*/

  return (
    <Fragment>
      <ProductCategories /*updateTotalRecords={handleUpdateTotalRecords}*/ />
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
          count={Math.ceil(
            paginationState.totalRecords / paginationState.pageSize,
          )}
          page={paginationState.currentPage}
          onChange={handlePageChange}
        />
      </Container>
    </Fragment>
  )
}

export default ProductsPage
