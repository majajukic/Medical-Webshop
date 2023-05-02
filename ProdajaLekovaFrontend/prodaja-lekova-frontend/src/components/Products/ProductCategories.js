import React, { useEffect, useState, Fragment } from 'react'
import { Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  getTipoviProizvoda,
  getProizvodiByTip,
  getProizvodiHomePage,
} from '../../services/proizvodService'
import { useProizvod } from '../../context/ProizvodContext'
import { GET_PRODUCTS, GET_PRODUCTS_BY_TYPE } from '../../constants/actionTypes'

const ProductCategories = () => {
  const [tipoviProivoda, setTipoviProizvoda] = useState([])
  const { dispatch: proizvodiDispatch } = useProizvod()
  const navigate = useNavigate()

  useEffect(() => {
    getTipoviProizvoda()
      .then((response) => {
        setTipoviProizvoda(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [proizvodiDispatch])

  const handleClick = (tipId) => {
    getProizvodiByTip(tipId)
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

  const handleShowAll = () => {
    getProizvodiHomePage()
      .then((response) => {
        proizvodiDispatch({
          type: GET_PRODUCTS,
          payload: response.data,
        })
        navigate("/")
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
        <Button variant='contained' onClick={handleShowAll}>Svi proizvodi</Button>
    </Box>
  )
}

export default ProductCategories
