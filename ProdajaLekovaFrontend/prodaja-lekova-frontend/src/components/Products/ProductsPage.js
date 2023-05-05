import React, { Fragment, useEffect, useCallback, useState } from 'react'
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
} from '../../services/proizvodService'
import {
  GET_PRODUCTS,
  GET_PRODUCTS_BY_PHARMACY,
} from '../../constants/actionTypes'
import { useParams } from 'react-router-dom'
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
  const [isDiscount, setIsDiscount] = useState(false)

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
    [paginationState, paginationDispatch],
  )

  useEffect(() => {
    console.log('home useeffect')
    if (!apotekaId && !kategorijaId && !terminPretrage && !isDiscount) {
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
    }
  }, [
    apotekaId,
    kategorijaId,
    terminPretrage,
    isDiscount,
    proizvodiDispatch,
    paginationState,
  ])

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
    } else if (!apotekaId && !kategorijaId && !terminPretrage && !isDiscount) {
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
    isDiscount,
    paginationDispatch,
    proizvodiDispatch,
  ])

  const handleIsDiscount = (isDiscount) => {
    setIsDiscount(isDiscount)
  }

  return (
    <Fragment>
      <ProductCategories />
      <ProductSorting handleDiscount={handleIsDiscount} />
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
