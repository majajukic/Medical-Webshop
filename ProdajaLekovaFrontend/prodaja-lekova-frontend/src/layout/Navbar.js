import React from 'react'
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
import { Link as RouteLink } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const theme = useTheme()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
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
            <MenuItem onClick={handleMenuClose}>Popuni podacima</MenuItem>
          </Menu>
        </Box>
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
          to="/upravljajApotekama"
          color="inherit"
          sx={{ marginX: '10px' }}
        >
          Upravljaj apotekama
        </Button>
        <Button
          component={RouteLink}
          to="/upravljajNalozima"
          color="inherit"
          sx={{ marginX: '10px' }}
        >
          Upravljaj nalozima
        </Button>
        <ShoppingCartIcon
          color="inherit"
          sx={{ marginX: '10px', fontSize: '2rem', cursor: 'pointer' }}
        />
        <AccountCircleIcon
          color="inherit"
          sx={{ marginX: '10px', fontSize: '2rem', cursor: 'pointer' }}
        />
        <Button
          component={RouteLink}
          to="/prijaviSe"
          variant="contained"
          color="inherit"
          sx={{
            marginX: '10px',
            backgroundColor: 'white',
            color: theme.palette.primary.main,
          }}
        >
          Prijavi se
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
