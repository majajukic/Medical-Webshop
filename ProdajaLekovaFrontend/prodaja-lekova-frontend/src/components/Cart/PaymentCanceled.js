import React from 'react'
import { Container, Typography, Button } from '@mui/material'
import { Cancel } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const PaymentCanceled = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Cancel
        sx={{
          fontSize: '3rem',
          color: 'red',
        }}
      />
      <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
        Poces naplate porudžbine je otkazan.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
      >
        Vrati se na početnu stranicu
      </Button>
    </Container>
  )
}

export default PaymentCanceled
