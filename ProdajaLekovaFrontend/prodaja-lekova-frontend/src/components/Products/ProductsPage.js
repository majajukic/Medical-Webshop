import React, { Fragment, useEffect, } from 'react'
import ProductCard from './ProductCard'
import ProductCategories from './ProductCategories'
import ProductSorting from './ProductSorting'
import ProductSearch from './ProductSearch'
import { Container, Grid, Typography } from '@mui/material'
import Pagination from '../Pagination'
import { useProizvod } from '../../context/ProizvodContext'
import {
  getProizvodiHomePage,
  getProizvodiByApoteka,
} from '../../services/proizvodService'
import { GET_PRODUCTS } from '../../constants/actionTypes'
import { useParams } from 'react-router-dom'

const ProductsPage = () => {
  const { state: proizvodiState, dispatch: proizvodiDispatch } = useProizvod()
  const { apotekaId } = useParams()

  useEffect(() => {
    if (apotekaId) {
      getProizvodiByApoteka(apotekaId)
        .then((response) => {
          proizvodiDispatch({ type: GET_PRODUCTS, payload: response.data })
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      getProizvodiHomePage()
        .then((response) => {
          proizvodiDispatch({ type: GET_PRODUCTS, payload: response.data })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [apotekaId, proizvodiDispatch])

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
        <Pagination />
      </Container>
    </Fragment>
  )
}

export default ProductsPage
