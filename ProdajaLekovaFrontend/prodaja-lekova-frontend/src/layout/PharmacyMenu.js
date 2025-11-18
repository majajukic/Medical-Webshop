import React, { memo } from 'react'
import { Button, MenuItem, Menu } from '@mui/material'
import { SPACING } from '../constants/themeConstants'

const PharmacyMenu = ({ pharmacies, onPharmacySelect }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handlePharmacyClick = (pharmacyId) => {
    onPharmacySelect(pharmacyId)
    handleMenuClose()
  }

  return (
    <>
      <Button
        color="inherit"
        onClick={handleMenuOpen}
        sx={{ marginX: SPACING.SMALL }}
      >
        Apoteke
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {pharmacies.length > 0 &&
          pharmacies.map((pharmacy) => (
            <MenuItem
              key={pharmacy.apotekaId}
              onClick={() => handlePharmacyClick(pharmacy.apotekaId)}
            >
              {pharmacy.nazivApoteke}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}

export default memo(PharmacyMenu)
