import React, {Fragment} from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import { TextField, InputAdornment, IconButton } from '@mui/material'

const ProductSearch = () => {
  return (
    <Fragment>
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
    </Fragment>
  )
}

export default ProductSearch
