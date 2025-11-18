import React, { memo } from 'react'
import { TextField, Button } from '@mui/material'
import { SPACING, PERCENTAGES } from '../../constants/themeConstants'

const AddToCartSection = ({ quantity, onQuantityChange, onAddToCart, maxQuantity }) => {
  return (
    <>
      <TextField
        label="Količina"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: 1,
          max: maxQuantity,
        }}
        value={quantity}
        onChange={onQuantityChange}
        sx={{ mt: 2, width: PERCENTAGES.HALF }}
      />
      <Button
        size="medium"
        variant="contained"
        onClick={onAddToCart}
        sx={{ mt: 2, ml: SPACING.SMALL }}
      >
        Dodaj u korpu
      </Button>
    </>
  )
}

export default memo(AddToCartSection)
