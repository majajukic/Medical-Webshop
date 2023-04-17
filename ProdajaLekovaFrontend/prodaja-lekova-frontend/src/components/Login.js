import * as React from 'react';
import loginSideImage from '../assets/login-side-img.jpg';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouteLink} from 'react-router-dom';
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
} from '@mui/material';

const Login = () => {

    const theme = useTheme();

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
          <Box
            component="form"
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email adresa"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Lozinka"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Prijavi me
            </Button>
            <Grid container sx={{textAlign: 'center'}}>
              <Grid item>
                <Link component={RouteLink} to="/registrujSe" variant="body2">
                  {"Nemaš nalog? Registruj se!"}
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
