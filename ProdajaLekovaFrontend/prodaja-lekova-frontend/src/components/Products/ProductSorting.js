import React from 'react';
import { Button, Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const ProductSorting = () => {
  return (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '50px',
      }}
    >
      <Typography variant="subtitle2" sx={{ mr: 1 }}>
        Sortiraj po ceni:
      </Typography>
      <RadioGroup row defaultValue="ascending">
        <FormControlLabel
          value="ascending"
          control={<Radio />}
          label="Rastuće"
        />
        <FormControlLabel
          value="descending"
          control={<Radio />}
          label="Opadajuće"
        />
      </RadioGroup>
      <Button size="small" variant="contained">
        Sortiraj
      </Button>
    </Box>
  )
}

export default ProductSorting
