import React, { useEffect, useState, Fragment } from 'react'
import { Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  getTipoviProizvoda,
  getProizvodiByTip,
 // getProizvodiByTipCount,
} from '../../services/proizvodService'
import { useProizvod } from '../../context/ProizvodContext'
import { GET_PRODUCTS_BY_TYPE } from '../../constants/actionTypes'
import { usePagination } from '../../context/PaginationContext'
//import { useParams } from 'react-router-dom'

const ProductCategories = () => {
  const [tipoviProivoda, setTipoviProizvoda] = useState([])
  const { dispatch: proizvodiDispatch } = useProizvod()
  const {
    state: paginationState,
    dispatch: paginationDispatch,
  } = usePagination()
  const navigate = useNavigate()
  //const { kategorijaId } = useParams()

  useEffect(() => {
    getTipoviProizvoda()
      .then((response) => {
        setTipoviProizvoda(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [proizvodiDispatch])

  /*useEffect(() => {
    console.log('count tipovi')
    if (kategorijaId) {
      getProizvodiByTipCount(kategorijaId)
        .then((response) => {
          updateTotalRecords(response.data)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [paginationDispatch, kategorijaId])*/

  const handleClick = (tipId) => {
    if (paginationState.totalRecords <= paginationState.pageSize) {
      paginationDispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })
    } else {
      paginationDispatch({
        type: 'SET_CURRENT_PAGE',
        payload: paginationState.currentPage,
      })
    }
    getProizvodiByTip(tipId, paginationState.currentPage)
      .then((response) => {
        proizvodiDispatch({
          type: GET_PRODUCTS_BY_TYPE,
          payload: response.data,
        })
        navigate(`/kategorija/${tipId}`)
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
