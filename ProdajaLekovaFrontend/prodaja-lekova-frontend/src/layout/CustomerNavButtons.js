import React, { Fragment, memo } from 'react'
import { Button, Badge } from '@mui/material'
import { Link as RouteLink } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { SPACING, FONT_SIZE } from '../constants/themeConstants'

const CustomerNavButtons = ({ cartItemCount }) => {
  return (
    <Fragment>
      <Button
        component={RouteLink}
        to="/korpa"
        variant="contained"
        sx={{ marginX: SPACING.SMALL }}
      >
        <Badge badgeContent={cartItemCount} color="error">
          <ShoppingCartIcon color="white" sx={{ fontSize: FONT_SIZE.XXLARGE }} />
        </Badge>
      </Button>
      <Button
        component={RouteLink}
        to="/profil"
        variant="contained"
        sx={{ marginX: SPACING.SMALL }}
      >
        <AccountCircleIcon color="white" sx={{ fontSize: FONT_SIZE.XXLARGE }} />
      </Button>
    </Fragment>
  )
}

export default memo(CustomerNavButtons)
