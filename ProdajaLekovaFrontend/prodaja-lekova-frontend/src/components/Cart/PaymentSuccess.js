import React from 'react'
import { Container, Typography, Button } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const PaymentSuccess = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <CheckCircle
        sx={{
          fontSize: '3rem',
          color: 'green',
        }}
      />
      <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
        Vaša porudžbina je uspešno plaćena!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Biće Vam dostavljena u narednih pola sata.
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

export default PaymentSuccess
