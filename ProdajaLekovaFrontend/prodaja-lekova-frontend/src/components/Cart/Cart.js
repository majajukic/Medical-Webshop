import React, { Fragment, useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { getUserRole } from '../../utilities/authUtilities'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router'
import CartItem from './CartItem'
import { useKorpa } from '../../context/KorpaContext'
import { getKorpa } from '../../services/porudzbinaService'
import { GET_CART } from '../../constants/actionTypes'

const Cart = () => {
  const role = getUserRole()
  const { state } = useAuth()
  const { state: korpaState, dispatch: korpaDispatch } = useKorpa()

  useEffect(() => {
    console.log('cart hook')
    if (role === 'Kupac' && state.token) {
      getKorpa(state.token)
        .then((response) => {
          korpaDispatch({ type: GET_CART, payload: response.data })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [korpaDispatch, state.token, role])

  if (role !== 'Kupac' || state?.token === null) {
    return <Navigate to="/notFound" />
  }

  return (
    <Box sx={{ marginTop: '100px' }}>
      {korpaState.porudzbina ? (
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: '30px' }}>
            Broj porudžbine: {korpaState.porudzbina.brojPorudzbine}
          </Typography>
          {korpaState.porudzbina.stavkaPorudzbine?.length > 0 &&
            korpaState.porudzbina.stavkaPorudzbine?.map((korpaItem) => (
              <CartItem key={korpaItem.stavkaId} item={korpaItem} />
            ))}
          <Typography
            variant="h5"
            sx={{ marginBottom: '20px', marginTop: '30px' }}
          >
            Ukupan iznos:{' '}
            {korpaState.porudzbina.ukupanIznos?.toLocaleString('sr-RS', {
              style: 'currency',
              currency: 'RSD',
            })}
          </Typography>
          <Button variant="contained">Plati porudžbinu</Button>
        </Fragment>
      ) : (
        <Typography variant="h5" sx={{ marginTop: '100px' }}>
          Korpa je prazna
        </Typography>
      )}
    </Box>
  )
}

export default Cart
