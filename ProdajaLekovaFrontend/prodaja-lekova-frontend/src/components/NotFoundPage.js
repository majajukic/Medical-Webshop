import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
    <Typography variant="h3" component="h1">404</Typography>
      <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
        Stranica nije pronadjena.
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Tražena stranica ne postoji ili je uklonjena.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary" sx={{ mt: 4 }}>
        Vrati se na početnu stranicu
      </Button>
    </Container>
  );
};

export default NotFoundPage;
