import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Menu,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
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
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PharmacyGO
        </Typography>
        <div>
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ margin: '0 10px' }}
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
        </div>
        <Button color="inherit" sx={{ margin: '0 10px' }}>
          Proizvodi
        </Button>
        <Button
          component={Link}
          to="/prijaviSe"
          variant="contained"
          color="inherit"
          sx={{
            margin: '0 10px',
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
          }}
        >
          Prijavi se
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
