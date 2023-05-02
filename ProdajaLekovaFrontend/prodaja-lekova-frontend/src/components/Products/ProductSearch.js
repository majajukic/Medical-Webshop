import React, { Fragment, useState } from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { getProizvodiBySearch } from '../../services/proizvodService'
import { useProizvod } from '../../context/ProizvodContext'
import { GET_PRODUCTS_BY_SEARCH } from '../../constants/actionTypes'
import { useNavigate } from 'react-router-dom'

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { dispatch: proizvodiDispatch } = useProizvod()
  const navigate = useNavigate()

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearch = (searchTerm) => {
    getProizvodiBySearch(searchTerm)
      .then((response) => {
        proizvodiDispatch({
          type: GET_PRODUCTS_BY_SEARCH,
          payload: response.data,
        })
        navigate("/")
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <Fragment>
      <TextField
        value={searchTerm}
        onChange={handleChange}
        sx={{
          marginTop: '70px',
          position: 'absolute',
          left: '53%',
          width: '60%',
          transform: 'translateX(-50%)',
        }}
        variant="outlined"
        label="Pretraga po nazivu proizvoda"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small" onClick={() => handleSearch(searchTerm)}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Fragment>
  )
}

export default ProductSearch
