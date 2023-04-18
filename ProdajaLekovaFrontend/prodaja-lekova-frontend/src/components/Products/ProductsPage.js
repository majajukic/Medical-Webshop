import React from 'react'
import ProductCard from './ProductCard'
import {
  Container,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  Link,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const ProductsPage = () => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '120px',
        }}
      >
        <Button sx={{ mr: 2 }} variant="outlined" size="small">
          Lekovi
        </Button>
        <Button sx={{ mr: 2 }} variant="outlined" size="small">
          Vitamini
        </Button>
        <Button sx={{ mr: 2 }} variant="outlined" size="small">
          Suplementi
        </Button>
        <Button sx={{ mr: 2 }} variant="outlined" size="small">
          Kozmetika
        </Button>
        <Button variant="outlined" size="small">
          Medicnska sredstva
        </Button>
      </Box>
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '50px',
        }}
      >
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          Sortiraj po ceni:
        </Typography>
        <RadioGroup row defaultValue="ascending">
          <FormControlLabel
            value="ascending"
            control={<Radio />}
            label="Rastuće"
          />
          <FormControlLabel
            value="descending"
            control={<Radio />}
            label="Opadajuće"
          />
        </RadioGroup>
        <Button size="small" variant="contained">
          Sortiraj
        </Button>
      </Box>
      <TextField
        sx={{
          marginTop: '70px',
          position: 'absolute',
          left: '53%',
          width: '60%',
          transform: 'translateX(-50%)',
        }}
        variant="outlined"
        label="Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={18} sx={{ marginTop: 4 }}>
          {cards.map((card) => (
            <Grid key={card} item xs={12} sm={6} md={4}>
              <ProductCard />
            </Grid>
          ))}
        </Grid>
        <Link color="primary" href="#" underline="none" sx={{ mt: 3}}>
          <Typography variant="subtitle1" sx={{marginTop: '50px' }}>Prikaži više</Typography>
        </Link>
      </Container>
    </div>
  )
}

export default ProductsPage
