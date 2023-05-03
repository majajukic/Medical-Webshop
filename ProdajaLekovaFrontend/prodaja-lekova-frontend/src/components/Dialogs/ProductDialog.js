import React, { useState, useEffect } from 'react'
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
import {
  createProizvod,
  getProizvodById,
  getTipoviProizvoda,
  getProizvodi,
  updateProizvod,
} from '../../services/proizvodService'

const initialState = {
  proizvodId: null,
  nazivProizvoda: '',
  proizvodjac: '',
  tipProizvodaId: 0,
}

const ProductDialog = ({
  dialogOpen,
  setDialogOpen,
  onAddNew,
  onEdit,
  productToEdit,
  isEdit,
  setIsEdit,
}) => {
  const [input, setInput] = useState(initialState)
  const [tipoviProizvoda, setTipoviProizvoda] = useState([])
  const { state } = useAuth()

  useEffect(() => {
    if (productToEdit) {
      setInput({
        proizvodId: productToEdit.proizvodId,
        nazivProizvoda: productToEdit.nazivProizvoda,
        proizvodjac: productToEdit.proizvodjac,
        tipProizvodaId: productToEdit.tipProizvoda.tipProizvodaId,
      })
      setIsEdit(true)
    }
  }, [productToEdit])

  useEffect(() => {
    console.log('dropdown useeffect')
    getTipoviProizvoda()
      .then((response) => {
        setTipoviProizvoda(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const handleClose = () => {
    setDialogOpen(false)

    if (isEdit) {
      setIsEdit(false)
    }
  }

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e) => {
    setInput({ ...input, tipProizvodaId: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isEdit) {
      try {
        const response = await updateProizvod(state.token, input)

        if (response.status === 200) {
          setInput(initialState)
          handleClose()
          getProizvodi()
            .then((response) => {
              onEdit(response.data)
            })
            .catch((error) => {
              console.error(error)
            })
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const response = await createProizvod(state.token, input)

        const createdProduct = await getProizvodById(
          state.token,
          response.data.proizvodId,
        )

        onAddNew(createdProduct.data)

        setInput(initialState)

        handleClose()
      } catch (error) {
        console.log(error)
      }
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
            sx={{ marginBottom: '20px' }}
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
            sx={{ marginBottom: '20px' }}
          />
          <Select
            labelId="Tip proizvoda"
            id="product-type"
            name="tipProizvoda"
            value={input.tipProizvodaId}
            onChange={handleSelectChange}
            sx={{ marginBottom: '20px' }}
            fullWidth
            required
          >
            <MenuItem value={0}>Izaberite tip proizvoda</MenuItem>
            {tipoviProizvoda.map((tip) => (
              <MenuItem key={tip.tipProizvodaId} value={tip.tipProizvodaId}>
                {tip.nazivTipaProizvoda}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Odustani
          </Button>
          <Button variant="contained" type="submit">
            {isEdit ? 'Sačuvaj' : 'Kreiraj'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default ProductDialog
