import React, { useEffect, useState, Fragment } from 'react'
import { Button, Box } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getTipoviProizvoda,
  getProizvodiByTip,
  getProizvodiByTipCount,
} from '../../services/proizvodService'
import { useProizvod } from '../../context/ProizvodContext'
import { GET_PRODUCTS_BY_TYPE } from '../../constants/actionTypes'
import { usePagination } from '../../context/PaginationContext'

const ProductCategories = () => {
  const [tipoviProivoda, setTipoviProizvoda] = useState([])
  const { dispatch: proizvodiDispatch } = useProizvod()
  const {
    state: paginationState,
    dispatch: paginationDispatch,
  } = usePagination()
  const navigate = useNavigate()
  const { kategorijaId } = useParams()

  useEffect(() => {
    getTipoviProizvoda()
      .then((response) => {
        setTipoviProizvoda(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [proizvodiDispatch])

  useEffect(() => {
    if (kategorijaId) {
      getProizvodiByTipCount(kategorijaId)
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
  },  [kategorijaId])

  const handleClick = (tipId) => {
    navigate(`/kategorija/${tipId}`)
    getProizvodiByTip(tipId, paginationState.currentPage)
      .then((response) => {
        proizvodiDispatch({
          type: GET_PRODUCTS_BY_TYPE,
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '120px',
      }}
    >
      {tipoviProivoda.length > 0 &&
        tipoviProivoda.map((tip) => (
          <Fragment key={tip.tipProizvodaId}>
            <Button
              sx={{ mr: 2 }}
              variant="outlined"
              size="small"
              onClick={() => handleClick(tip.tipProizvodaId)}
            >
              {tip.nazivTipaProizvoda}
            </Button>
          </Fragment>
        ))}
    </Box>
  )
}

export default ProductCategories
