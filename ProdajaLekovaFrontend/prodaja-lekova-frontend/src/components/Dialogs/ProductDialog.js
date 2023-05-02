import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  Box,
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { createProizvod, getProizvodById } from '../../services/proizvodService'

const initialState = {
  nazivProizvoda: '',
  proizvodjac: '',
  tipProizvodaId: 0,
}

const ProductDialog = ({ dialogOpen, setDialogOpen, onAddNew }) => {
  const [input, setInput] = useState(initialState)
  const { state } = useAuth()

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e) => {
    setInput({ ...input, tipProizvodaId: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await createProizvod(state.token, input)

      const createdProduct = await getProizvodById(state.token, response.data.proizvodId)

      onAddNew(createdProduct.data)

      setInput(initialState)

      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={dialogOpen} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="product-name"
            label="Naziv proizvoda"
            name="nazivProizvoda"
            type="text"
            fullWidth
            required
            value={input.nazivProizvoda}
            onChange={handleInputChange}
            sx={{marginBottom:'20px'}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="manufacturer-name"
            label="Naziv proizvodjaca"
            name="proizvodjac"
            type="text"
            fullWidth
            required
            value={input.proizvodjac}
            onChange={handleInputChange}
            sx={{marginBottom:'20px'}}
          />
          <Select
            labelId="Tip proizvoda"
            id="product-type"
            name="tipProizvoda"
            value={input.tipProizvodaId}
            onChange={handleSelectChange}
            sx={{marginBottom:'20px'}}
            fullWidth
            required
          >
            <MenuItem value={0}>Izaberite tip proizvoda</MenuItem>
            <MenuItem value={1}>Lek</MenuItem>
            <MenuItem value={2}>Vitamin</MenuItem>
            <MenuItem value={3}>Suplement</MenuItem>
            <MenuItem value={4}>Kozmetika</MenuItem>
            <MenuItem value={5}>Medicinsko sredstvo</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default ProductDialog
