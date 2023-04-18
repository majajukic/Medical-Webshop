import React from 'react';
import ProductCard from './ProductCard';
import ProductCategories from './ProductCategories';
import ProductSorting from './ProductSorting';
import ProductSearch from './ProductSearch';
import { Container, Grid } from '@mui/material';
import Pagination from '../Pagination';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const ProductsPage = () => {
  return (
    <div>
      <ProductCategories />
      <ProductSorting />
      <ProductSearch />
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={18} sx={{ marginTop: 4, marginBottom: 2 }}>
          {cards.map((card) => (
            <Grid key={card} item xs={12} sm={6} md={4}>
              <ProductCard />
            </Grid>
          ))}
        </Grid>
        <Pagination />
      </Container>
    </div>
  )
}

export default ProductsPage
