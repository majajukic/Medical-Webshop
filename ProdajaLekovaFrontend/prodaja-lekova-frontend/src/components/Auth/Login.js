import React, { useState } from 'react'
import loginSideImage from '../../assets/login-side-img.jpg'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Link as RouteLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login } from '../../services/authService'
import { LOGIN } from '../../constants/actionTypes'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import { toast } from 'react-toastify'

const initialState = {
  email: '',
  lozinka: '',
}

const Login = () => {
  const theme = useTheme()
  const { state, dispatch } = useAuth()
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

    const response = await login(formData)

    if (response === 400) {
      toast.error('Nalog ne postoji ili su kredencijali pogrešni.')
    } else {
      dispatch({ type: LOGIN, payload: response.data })

      navigate('/')
    }
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${loginSideImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: theme.palette.secondary.main,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Prijavi se
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              id="email"
              label="Email adresa"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lozinka"
              label="Lozinka"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.lozinka}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Prijavi me
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
                <Link component={RouteLink} to="/registrujSe" variant="body2">
                  {'Nemaš nalog? Registruj se!'}
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
      </Grid>
    </Grid>
  )
}

export default Login
