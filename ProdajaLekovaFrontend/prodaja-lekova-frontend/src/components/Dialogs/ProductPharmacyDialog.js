import { useState, useEffect } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useApoteka } from '../../context/ApotekaContext'
import { useProizvod } from '../../context/ProizvodContext'
import {
  getProizvodi,
  addProizvodToApoteka,
  updateProizvodInApoteka,
  getProizvodByApoteka,
  getProizvodiByApoteka,
} from '../../services/proizvodService'
import {
  ADD_PRODUCT_TO_PHARMACY,
  GET_PRODUCTS_BY_PHARMACY,
} from '../../constants/actionTypes'
import { useNavigate } from 'react-router-dom'
import { usePagination } from '../../context/PaginationContext'
import { toast } from 'react-toastify'
import BaseDialog from './BaseDialog'
import { useDialogForm } from '../../hooks/useDialogForm'

const initialState = {
  apotekaProizvodId: null,
  proizvodId: 0,
  apotekaId: 0,
  stanjeZaliha: '',
  slika: '',
  popustUprocentima: '',
  cenaBezPopusta: '',
}

const ProductPharmacyDialog = ({
  dialogOpen,
  setDialogOpen,
  productToEdit,
  isEdit,
  setIsEdit,
}) => {
  const [proizvodi, setProizvodi] = useState([])
  const { state: apotekaState } = useApoteka()
  const { dispatch: proizvodiDispatch } = useProizvod()
  const { state: paginationState } = usePagination()
  const { state } = useAuth()
  const navigate = useNavigate()

  const productToEditMapped = productToEdit
    ? {
        apotekaProizvodId: productToEdit.apotekaProizvodId,
        proizvodId: productToEdit.proizvod.proizvodId,
        apotekaId: productToEdit.apoteka.apotekaId,
        stanjeZaliha: productToEdit.stanjeZaliha,
        slika: productToEdit.slika || '',
        popustUprocentima: productToEdit.popustUprocentima || '',
        cenaBezPopusta: productToEdit.cenaBezPopusta,
      }
    : null

  const { formData, handleInputChange, handleSelectChange, resetForm } =
    useDialogForm(initialState, productToEditMapped, setIsEdit)

  useEffect(() => {
    getProizvodi()
      .then((response) => {
        setProizvodi(response.data)
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
        const response = await updateProizvodInApoteka(state.token, formData)

        if (response.status === 200) {
          handleClose()
          getProizvodiByApoteka(formData.apotekaId, paginationState.currentPage)
            .then((response) => {
              proizvodiDispatch({
                type: GET_PRODUCTS_BY_PHARMACY,
                payload: response.data,
              })
            })
            .catch((error) => {
              console.error(error)
            })
          navigate(`/apoteka/${formData.apotekaId}`)
          toast.success('Proizvod u apoteci uspešno ažuriran!')
        } else if (response === 422) {
          toast.error('Vrednost stanja zaliha, popusta i cene ne sme biti 0')
        }
      } catch (error) {
        console.error(error)
        toast.error('Greška pri ažuriranju proizvoda u apoteci.')
      }
    } else {
      try {
        const response = await addProizvodToApoteka(state.token, formData)

        if (response === 422) {
          toast.error('Vrednost stanja zaliha, popusta i cene ne sme biti 0')
        } else {
          const addedProduct = await getProizvodByApoteka(
            response.data.apotekaProizvodId,
          )

          proizvodiDispatch({
            type: ADD_PRODUCT_TO_PHARMACY,
            payload: addedProduct.data,
          })

          handleClose()

          toast.success(
            'Proizvod uspesno dodat u apoteku ' +
              addedProduct.data.apoteka.nazivApoteke,
          )

          navigate(`/apoteka/${addedProduct.data.apoteka.apotekaId}`)
        }
      } catch (error) {
        console.error(error)
        toast.error('Greška pri dodavanju proizvoda u apoteku.')
      }
    }
  }

  return (
    <BaseDialog
      open={dialogOpen}
      onClose={handleClose}
      title={
        isEdit
          ? 'Izmeni proizvod u apoteci'
          : 'Dodaj proizvod u apoteku'
      }
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Sačuvaj' : 'Kreiraj'}
      cancelLabel="Odustani"
    >
      <TextField
        autoFocus
        margin="dense"
        id="stock"
        label="Stanje zaliha"
        name="stanjeZaliha"
        type="text"
        fullWidth
        required
        value={formData.stanjeZaliha}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        margin="dense"
        id="image"
        label="Slika proizvoda (URL)"
        name="slika"
        type="text"
        fullWidth
        value={formData.slika}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        margin="dense"
        id="discount"
        label="Popust (u procentima)"
        name="popustUprocentima"
        type="text"
        fullWidth
        value={formData.popustUprocentima}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        margin="dense"
        id="price"
        label="Cena bez popusta"
        name="cenaBezPopusta"
        type="text"
        fullWidth
        required
        value={formData.cenaBezPopusta}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <Select
        labelId="Proizvodi"
        id="products"
        name="proizvodId"
        value={formData.proizvodId}
        onChange={handleSelectChange('proizvodId')}
        sx={{ marginBottom: '20px' }}
        fullWidth
        required
      >
        <MenuItem value={0}>Izaberite proizvod</MenuItem>
        {proizvodi.map((proizvod) => (
          <MenuItem key={proizvod.proizvodId} value={proizvod.proizvodId}>
            {proizvod.nazivProizvoda}
          </MenuItem>
        ))}
      </Select>
      <Select
        labelId="Apoteka"
        id="pharmacies"
        name="apotekaId"
        value={formData.apotekaId}
        onChange={handleSelectChange('apotekaId')}
        sx={{ marginBottom: '20px' }}
        fullWidth
        required
      >
        <MenuItem value={0}>Izaberite apoteku</MenuItem>
        {apotekaState.apoteke.map((apoteka) => (
          <MenuItem key={apoteka.apotekaId} value={apoteka.apotekaId}>
            {apoteka.nazivApoteke}
          </MenuItem>
        ))}
      </Select>
    </BaseDialog>
  )
}

export default ProductPharmacyDialog
