import React, { useState, useEffect } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import DialogWrapper from '../Common/DialogWrapper'
import {
  createProizvod,
  getProizvodById,
  getTipoviProizvoda,
  getProizvodi,
  updateProizvod,
} from '../../services/proizvodService'
import { SPACING } from '../../constants/themeConstants'

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

  const handleSubmit = async () => {
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
    <DialogWrapper
      open={dialogOpen}
      onClose={handleClose}
      title={isEdit ? 'Izmeni proizvod' : 'Dodaj novi proizvod'}
      onSubmit={handleSubmit}
      showDefaultActions={true}
      submitText={isEdit ? 'Sačuvaj' : 'Kreiraj'}
      cancelText="Odustani"
    >
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
        sx={{ marginBottom: SPACING.LARGE }}
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
        sx={{ marginBottom: SPACING.LARGE }}
      />
      <Select
        labelId="Tip proizvoda"
        id="product-type"
        name="tipProizvoda"
        value={input.tipProizvodaId}
        onChange={handleSelectChange}
        sx={{ marginBottom: SPACING.LARGE }}
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
    </DialogWrapper>
  )
}

export default ProductDialog
