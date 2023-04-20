import React, { useState } from 'react'
import { register } from '../../services/api'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useTheme } from '@mui/material'
import { Link as RouteLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const initialState = {
  ime: '',
  prezime: '',
  email: '',
  lozinka: '',
  brojTelefona: '',
  ulica: '',
  broj: '',
  mesto: '',
}

const Register = () => {
  const theme = useTheme()
  const { state } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialState)

  if (state.token) {
    return <Navigate to="/" />
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await register(formData)

      alert(
        'Vaš nalog je uspešno kreiran! Nakon potvrde ove poruke, možete se prijaviti u aplikaciju.',
      )

      navigate('/prijaviSe')
    } catch (error) {
      if (error.response.status === 400) {
        alert('Korisnik sa datom mejl adresom već postoji u bazi.')
      } else if (error.response.status === 422) {
        alert(
          'Lozinka mora imati minimum 8 karaktera - slova i brojeve.',
        )
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registruj se
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="ime"
                required
                fullWidth
                id="firstName"
                label="Ime"
                autoFocus
                value={formData.ime}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Prezime"
                name="prezime"
                autoComplete="family-name"
                value={formData.prezime}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email adresa"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="lozinka"
                label="Lozinka"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.lozinka}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="phoneNumber"
                label="Broj telefona"
                name="brojTelefona"
                autoComplete="phone-number"
                value={formData.brojTelefona}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="street"
                label="Ulica"
                name="ulica"
                autoComplete="street"
                value={formData.ulica}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="houseNumber"
                label="Broj kuće/stana"
                name="broj"
                autoComplete="house-number"
                value={formData.broj}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="city"
                label="Mesto stanovanja"
                name="mesto"
                autoComplete="city"
                value={formData.mesto}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registruj me
          </Button>
          <Grid
            container
            justifyContent="center"
            direction="column"
            alignItems="center"
            spacing={1}
            sx={{ marginTop: '10px' }}
          >
            <Grid item>
              <Link component={RouteLink} to="/prijaviSe" variant="body2">
                Već imaš nalog? Prijavi se.
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouteLink} to="/" variant="body2">
                {'Nazad na početnu stranicu.'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default Register
