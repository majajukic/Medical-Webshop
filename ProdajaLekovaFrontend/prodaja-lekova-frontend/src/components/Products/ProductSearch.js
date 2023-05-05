import React, { Fragment, useState, useEffect } from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import {
  getProizvodiBySearch,
  getProizvodiBySearchCount,
} from '../../services/proizvodService'
import { useProizvod } from '../../context/ProizvodContext'
import { GET_PRODUCTS_BY_SEARCH } from '../../constants/actionTypes'
import { useNavigate, useParams } from 'react-router-dom'
import { usePagination } from '../../context/PaginationContext'

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { dispatch: proizvodiDispatch } = useProizvod()
  const { dispatch: paginationDispatch } = usePagination()
  const navigate = useNavigate()
  const { terminPretrage } = useParams()

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
        if (searchTerm) {
          navigate(`/proizvodi/${searchTerm}`)
          setSearchTerm('')
        } else {
          navigate('/')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    console.log('count search')
    if (terminPretrage) {
      getProizvodiBySearchCount(terminPretrage)
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
  }, [terminPretrage])

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
