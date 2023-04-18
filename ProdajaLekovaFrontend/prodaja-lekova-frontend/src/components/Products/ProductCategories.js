import React from 'react';
import { Button, Box } from '@mui/material';

//ovde dinamicki popuniti sa podacima
const ProductCategories = () => {
  return (
    <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '120px',
        }}
      >
      <Button sx={{ mr: 2 }} variant="outlined" size="small">
        Lekovi
      </Button>
      <Button sx={{ mr: 2 }} variant="outlined" size="small">
        Vitamini
      </Button>
      <Button sx={{ mr: 2 }} variant="outlined" size="small">
        Suplementi
      </Button>
      <Button sx={{ mr: 2 }} variant="outlined" size="small">
        Kozmetika
      </Button>
      <Button variant="outlined" size="small">
        Medicnska sredstva
      </Button>
    </Box>
  )
}

export default ProductCategories
