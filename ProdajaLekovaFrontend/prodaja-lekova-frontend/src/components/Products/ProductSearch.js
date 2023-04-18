import React from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import { TextField, InputAdornment, IconButton } from '@mui/material'

const ProductSearch = () => {
  return (
    <div>
      <TextField
        sx={{
          marginTop: '70px',
          position: 'absolute',
          left: '53%',
          width: '60%',
          transform: 'translateX(-50%)',
        }}
        variant="outlined"
        label="Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  )
}

export default ProductSearch
