import React, { useState } from 'react'
import {
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import {
  getProizvodiCenaRastuce,
  getProizvodiCenaOpadajuce,
  getProizvodiPopust,
} from '../../services/proizvodService'
import { useProizvod } from '../../context/ProizvodContext'
import {
  GET_PRODUCTS_ASCENDING,
  GET_PRODUCTS_DESCENDING,
  GET_PRODUCTS_DISCOUNT,
} from '../../constants/actionTypes'

const ProductSorting = () => {
  const [sortDirection, setSortDirection] = useState('ascending')
  const { dispatch: proizvodiDispatch } = useProizvod()

  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value)
  }

  const handleSort = () => {
    if (sortDirection === 'ascending') {
      getProizvodiCenaRastuce()
        .then((response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_ASCENDING,
            payload: response.data,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      getProizvodiCenaOpadajuce()
        .then((response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_DESCENDING,
            payload: response.data,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleFilter = () => {
    getProizvodiPopust()
      .then((response) => {
        proizvodiDispatch({
          type: GET_PRODUCTS_DISCOUNT,
          payload: response.data,
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
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
      <RadioGroup
        row
        value={sortDirection}
        onChange={handleSortDirectionChange}
      >
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
      <Button size="small" variant="contained" onClick={handleSort}>
        Sortiraj
      </Button>
      <Button size="small" variant="outlined" sx={{marginLeft:'30px'}} onClick={handleFilter}>
        Proizvodi na popustu
      </Button>
    </Box>
  )
}

export default ProductSorting
