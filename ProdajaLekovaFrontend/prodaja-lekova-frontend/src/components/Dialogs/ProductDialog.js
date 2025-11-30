import { useState, useEffect } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import {
  createProizvod,
  getProizvodById,
  getTipoviProizvoda,
  getProizvodi,
  updateProizvod,
} from '../../services/proizvodService'
import BaseDialog from './BaseDialog'
import { useDialogForm } from '../../hooks/useDialogForm'
import { toast } from 'react-toastify'

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
  const [tipoviProizvoda, setTipoviProizvoda] = useState([])
  const { state } = useAuth()

  const productToEditMapped = productToEdit
    ? {
        proizvodId: productToEdit.proizvodId,
        nazivProizvoda: productToEdit.nazivProizvoda,
        proizvodjac: productToEdit.proizvodjac,
        tipProizvodaId: productToEdit.tipProizvoda?.tipProizvodaId || 0,
      }
    : null

  const { formData, handleInputChange, handleSelectChange, resetForm } =
    useDialogForm(initialState, productToEditMapped, setIsEdit)

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
    setIsEdit(false)
    resetForm()
  }

  const handleSubmit = async () => {
    if (isEdit) {
      try {
        const response = await updateProizvod(state.token, formData)

        if (response.status === 200) {
          handleClose()
          getProizvodi()
            .then((response) => {
              onEdit(response.data)
            })
            .catch((error) => {
              console.error(error)
            })
          toast.success('Proizvod uspešno ažuriran!')
        }
      } catch (error) {
        console.error(error)
        toast.error('Greška pri ažuriranju proizvoda.')
      }
    } else {
      try {
        const response = await createProizvod(state.token, formData)

        const createdProduct = await getProizvodById(
          state.token,
          response.data.proizvodId
        )

        onAddNew(createdProduct.data)
        handleClose()
        toast.success('Proizvod uspešno kreiran!')
      } catch (error) {
        console.error(error)
        toast.error('Greška pri kreiranju proizvoda.')
      }
    }
  }

  return (
    <BaseDialog
      open={dialogOpen}
      onClose={handleClose}
      title={isEdit ? 'Izmeni proizvod' : 'Dodaj novi proizvod'}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Sačuvaj' : 'Kreiraj'}
      cancelLabel="Odustani"
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
        value={formData.nazivProizvoda}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        margin="dense"
        id="manufacturer-name"
        label="Naziv proizvodjaca"
        name="proizvodjac"
        type="text"
        fullWidth
        required
        value={formData.proizvodjac}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <Select
        labelId="Tip proizvoda"
        id="product-type"
        name="tipProizvodaId"
        value={formData.tipProizvodaId}
        onChange={handleSelectChange('tipProizvodaId')}
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
    </BaseDialog>
  )
}

export default ProductDialog
