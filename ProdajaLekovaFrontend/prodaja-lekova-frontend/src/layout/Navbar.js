import React, { Fragment, useState, useEffect } from 'react'
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
  MenuItem,
  Menu,
  Link,
  Box,
  Badge,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { Link as RouteLink, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
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

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
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

  const handleMenuItemClick = (apotekaId) => {
    navigate(`/apoteka/${apotekaId}`)
    getProizvodiByApoteka(apotekaId, paginationState.currentPage)
      .then((response) => {
        proizvodiDispatch({
          type: GET_PRODUCTS_BY_PHARMACY,
          payload: response.data,
        })
        handleMenuClose()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDisplayAll = () => {
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
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAuth = () => {
    if (state.token) {
      dispatch({ type: LOGOUT })
    }

    navigate('/prijaviSe')
  }

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
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ marginX: '10px' }}
          >
            Apoteke
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {apotekaState.apoteke.length > 0 &&
              apotekaState.apoteke.map((apoteka) => (
                <MenuItem
                  key={apoteka.apotekaId}
                  onClick={() => handleMenuItemClick(apoteka.apotekaId)}
                >
                  {apoteka.nazivApoteke}
                </MenuItem>
              ))}
          </Menu>
        </Box>
        {role === 'Admin' && (
          <Fragment>
            <Button
              component={RouteLink}
              to="/upravljajApotekama"
              color="inherit"
              sx={{ marginX: '10px' }}
            >
              Upravljaj apotekama
            </Button>
            <Button
              component={RouteLink}
              to="/upravljajProizvodima"
              color="inherit"
              sx={{ marginX: '10px' }}
            >
              Upravljaj proizvodima
            </Button>
            <Button
              component={RouteLink}
              to="/upravljajNalozima"
              color="inherit"
              sx={{ marginX: '10px' }}
            >
              Upravljaj nalozima
            </Button>
          </Fragment>
        )}
        {role === 'Kupac' && (
          <Button
            component={RouteLink}
            to="/korpa"
            variant="contained"
            sx={{ marginX: '10px' }}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon color="white" sx={{ fontSize: '2rem' }} />
            </Badge>
          </Button>
        )}
        {(role === 'Kupac' || role === 'Admin') && (
          <Button
            component={RouteLink}
            to="/profil"
            variant="contained"
            sx={{ marginX: '10px' }}
          >
            <AccountCircleIcon color="white" sx={{ fontSize: '2rem' }} />
          </Button>
        )}
        <Button
          onClick={handleAuth}
          variant="contained"
          color="inherit"
          sx={{
            marginX: '10px',
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

export default Navbar
