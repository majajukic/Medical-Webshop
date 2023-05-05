import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { usePagination } from '../../context/PaginationContext'
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
  getProizvodiByDiscountCount,
  getProizvodiCount
} from '../../services/proizvodService'
import { useProizvod } from '../../context/ProizvodContext'
import {
  GET_PRODUCTS_ASCENDING,
  GET_PRODUCTS_DESCENDING,
  GET_PRODUCTS_DISCOUNT,
} from '../../constants/actionTypes'

const ProductSorting = ({handleDiscount}) => {
  const [sortDirection, setSortDirection] = useState('ascending')
  const [isDisocunt, setIsDiscount] = useState(false)
  const { dispatch: proizvodiDispatch } = useProizvod()
  const {
    state: paginationState,
    dispatch: paginationDispatch,
  } = usePagination()
  const navigate = useNavigate()

  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value)
  }

  useEffect(() => {
    console.log('count discount')
    if (isDisocunt) {
      getProizvodiByDiscountCount()
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
  },  [isDisocunt])

  const handleSort = () => {
    setIsDiscount(false)
    handleDiscount(false)
    if (sortDirection === 'ascending') {
      getProizvodiCenaRastuce(paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_ASCENDING,
            payload: response.data,
          })
          navigate("/proizvodi/cenaRastuce")
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      setIsDiscount(false)
      handleDiscount(false)
      getProizvodiCenaOpadajuce(paginationState.currentPage)
        .then((response) => {
          proizvodiDispatch({
            type: GET_PRODUCTS_DESCENDING,
            payload: response.data,
          })
          navigate("/proizvodi/cenaOpadajuce")
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleFilter = () => {
    setIsDiscount(true)
    handleDiscount(true)
    getProizvodiPopust()
      .then((response) => {
        proizvodiDispatch({
          type: GET_PRODUCTS_DISCOUNT,
          payload: response.data,
        })
        navigate("/proizvodi/naPopustu")
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
