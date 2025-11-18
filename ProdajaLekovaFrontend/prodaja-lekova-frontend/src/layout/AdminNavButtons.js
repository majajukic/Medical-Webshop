import React, { Fragment, memo } from 'react'
import { Button } from '@mui/material'
import { Link as RouteLink } from 'react-router-dom'
import { SPACING } from '../constants/themeConstants'

const AdminNavButtons = () => {
  return (
    <Fragment>
      <Button
        component={RouteLink}
        to="/upravljajApotekama"
        color="inherit"
        sx={{ marginX: SPACING.SMALL }}
      >
        Upravljaj apotekama
      </Button>
      <Button
        component={RouteLink}
        to="/upravljajProizvodima"
        color="inherit"
        sx={{ marginX: SPACING.SMALL }}
      >
        Upravljaj proizvodima
      </Button>
      <Button
        component={RouteLink}
        to="/upravljajNalozima"
        color="inherit"
        sx={{ marginX: SPACING.SMALL }}
      >
        Upravljaj nalozima
      </Button>
    </Fragment>
  )
}

export default memo(AdminNavButtons)
