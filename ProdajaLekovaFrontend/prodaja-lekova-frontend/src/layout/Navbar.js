import React, { useEffect, memo, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApoteka } from '../context/ApotekaContext'
import { getUserRole } from '../utilities/authUtilities'
import {
  GET_PHARMACIES,
  LOGOUT,
  GET_PRODUCTS_BY_PHARMACY,
  GET_PRODUCTS,
  GET_CART
} from '../constants/actionTypes'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link,
  Box,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getApoteke } from '../services/apotekaService'
import { useProizvod } from '../context/ProizvodContext'
import {
  getProizvodiByApoteka,
  getProizvodiHomePage,
} from '../services/proizvodService'
import { usePagination } from '../context/PaginationContext'
import { getProizvodiCount } from '../services/api'
import { useKorpa } from '../context/KorpaContext'
import { getKorpa } from '../services/porudzbinaService'
import PharmacyMenu from './PharmacyMenu'
import AdminNavButtons from './AdminNavButtons'
import CustomerNavButtons from './CustomerNavButtons'
import { SPACING } from '../constants/themeConstants'

const Navbar = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useAuth()
  const { state: apotekaState, dispatch: apotekaDispatch } = useApoteka()
  const { state: korpaState, dispatch: korpaDispatch } = useKorpa()
  const cartItemCount = korpaState.porudzbina?.stavkaPorudzbine?.length || 0

  const { dispatch: proizvodiDispatch } = useProizvod()
  const {
    state: paginationState,
    dispatch: paginationDispatch,
  } = usePagination()
  const theme = useTheme()
  const role = getUserRole()

  useEffect(() => {
    getApoteke()
      .then((response) => {
        apotekaDispatch({ type: GET_PHARMACIES, payload: response.data })
      })
      .catch((error) => {
        console.error(error)
      })
      if (role === 'Kupac' && state.token) {
        getKorpa(state.token)
          .then((response) => {
            korpaDispatch({ type: GET_CART, payload: response.data })
          })
          .catch((error) => {
            console.error(error)
          })
        }
  }, [apotekaDispatch, role, state.token, korpaDispatch, cartItemCount])

  const handlePharmacySelect = useCallback((apotekaId) => {
    navigate(`/apoteka/${apotekaId}`)
    getProizvodiByApoteka(apotekaId, paginationState.currentPage)
      .then((response) => {
        proizvodiDispatch({
          type: GET_PRODUCTS_BY_PHARMACY,
          payload: response.data,
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }, [navigate, paginationState.currentPage, proizvodiDispatch])

  const handleDisplayAll = useCallback(() => {
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

    getProizvodiHomePage(paginationState.currentPage)
      .then((response) => {
        proizvodiDispatch({ type: GET_PRODUCTS, payload: response.data })
        navigate('/')
      })
      .catch((error) => {
        console.error(error)
      })
  }, [paginationState.currentPage, paginationDispatch, proizvodiDispatch, navigate])

  const handleAuth = useCallback(() => {
    if (state.token) {
      dispatch({ type: LOGOUT })
    }
    navigate('/prijaviSe')
  }, [state.token, dispatch, navigate])

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          onClick={handleDisplayAll}
          sx={{ color: 'white', cursor: 'pointer' }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PharmacyGO
          </Typography>
        </Link>
        <Box>
          <PharmacyMenu
            pharmacies={apotekaState.apoteke}
            onPharmacySelect={handlePharmacySelect}
          />
        </Box>
        {role === 'Admin' && <AdminNavButtons />}
        {role === 'Kupac' && <CustomerNavButtons cartItemCount={cartItemCount} />}
        <Button
          onClick={handleAuth}
          variant="contained"
          color="inherit"
          sx={{
            marginX: SPACING.SMALL,
            backgroundColor: 'white',
            color: theme.palette.primary.main,
          }}
        >
          {state.token ? 'Odjavi se' : 'Prijavi se'}
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default memo(Navbar)
