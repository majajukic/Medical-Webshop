import React, { Fragment, useEffect } from 'react'
import ProductCard from './ProductCard'
import ProductCategories from './ProductCategories'
import ProductSorting from './ProductSorting'
import ProductSearch from './ProductSearch'
import { Container, Grid, Typography } from '@mui/material'
import Pagination from '../Pagination'
import { useProizvod } from '../../context/ProizvodContext'
import { getProizvodiHomePage } from '../../services/proizvodService'
import { GET_PRODUCTS } from '../../constants/actionTypes'

const ProductsPage = () => {
  const { state: proizvodiState, dispatch: proizvodiDispatch } = useProizvod()

  useEffect(() => {
    getProizvodiHomePage()
      .then((response) => {
        proizvodiDispatch({ type: GET_PRODUCTS, payload: response.data })
      })
      .catch((error) => {
        console.error(error)
      })
  }, [proizvodiDispatch])

  return (
    <Fragment>
      <ProductCategories />
      <ProductSorting />
      <ProductSearch />
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={18} sx={{ marginTop: 4, marginBottom: 2 }}>
          {proizvodiState.proizvodi.length > 0 ? proizvodiState.proizvodi.map((proizvod) => (
            <Grid key={proizvod.apotekaProizvodId} item xs={12} sm={6} md={4}>
              <ProductCard proizvodProp={proizvod} />
            </Grid>
          )) : <Typography sx={{marginTop: '150px'}}>Trenutno nema proizvoda</Typography>}
        </Grid>
        {proizvodiState.proizvodi.length > 9 && (
          <Pagination />
        )}
      </Container>
    </Fragment>
  )
}

export default ProductsPage
