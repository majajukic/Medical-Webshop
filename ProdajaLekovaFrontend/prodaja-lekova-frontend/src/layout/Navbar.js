import React, { Fragment, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserRole } from '../utilities/authUtilities'
import { LOGOUT } from '../constants/actionTypes'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Menu,
  Link,
  Box,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { Link as RouteLink, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { getApoteke } from '../services/apotekaService'

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [apoteke, setApoteke] = useState([])
  const navigate = useNavigate()
  const { state, dispatch } = useAuth()
  const theme = useTheme()
  const role = getUserRole()

  useEffect(() => {
    getApoteke()
      .then((response) => {
        setApoteke(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

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
        <Link component={RouteLink} to="/" sx={{ color: 'white' }}>
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
          {apoteke.length > 0 && apoteke.map((apoteka) => (
            <MenuItem key={apoteka.apotekaId} onClick={handleMenuClose}>
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
            /*component={RouteLink} to="/korpa"*/ variant="contained"
            sx={{ marginX: '10px' }}
          >
            <ShoppingCartIcon color="white" sx={{ fontSize: '2rem' }} />
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
