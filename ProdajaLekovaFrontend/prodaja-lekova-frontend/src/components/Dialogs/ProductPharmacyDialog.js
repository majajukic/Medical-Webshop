import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApoteka } from '../../context/ApotekaContext'
import { useProizvod } from '../../context/ProizvodContext'
import {
  getProizvodi,
  addProizvodToApoteka,
  updateProizvodInApoteka,
} from '../../services/proizvodService'
import {
  TextField,
  Select,
  MenuItem,
  Box,
} from '@mui/material'
import DialogWrapper from '../Common/DialogWrapper'
import {
  ADD_PRODUCT_TO_PHARMACY,
  GET_PRODUCTS_BY_PHARMACY,
} from '../../constants/actionTypes'
import {
  getProizvodByApoteka,
  getProizvodiByApoteka,
} from '../../services/proizvodService'
import { useNavigate } from 'react-router-dom'
import { usePagination } from '../../context/PaginationContext'
import { toast } from 'react-toastify'

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
  const [input, setInput] = useState(initialState)
  const [proizvodi, setProizvodi] = useState([])
  const { state: apotekaState } = useApoteka()
  const { dispatch: proizvodiDispatch } = useProizvod()
  const { state: paginationState } = usePagination()
  const { state } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (productToEdit) {
      setInput({
        apotekaProizvodId: productToEdit.apotekaProizvodId,
        proizvodId: productToEdit.proizvod.proizvodId,
        apotekaId: productToEdit.apoteka.apotekaId,
        stanjeZaliha: productToEdit.stanjeZaliha,
        slika: productToEdit.slika || '',
        popustUprocentima: productToEdit.popustUprocentima || '',
        cenaBezPopusta: productToEdit.cenaBezPopusta,
      })
      setIsEdit(true)
    }
  }, [productToEdit])

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

    if (isEdit) {
      setIsEdit(false)
    }
  }

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isEdit) {
      try {
        const response = await updateProizvodInApoteka(state.token, input)

        if (response.status === 200) {
          setInput(initialState)
          handleClose()
          getProizvodiByApoteka(input.apotekaId, paginationState.currentPage)
            .then((response) => {
              proizvodiDispatch({
                type: GET_PRODUCTS_BY_PHARMACY,
                payload: response.data,
              })
            })
            .catch((error) => {
              console.error(error)
            })
          navigate(`/apoteka/${input.apotekaId}`)
        } else if (response === 422) {
          toast.error('Vrednost stanja zaliha, popusta i cene ne sme biti 0')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const response = await addProizvodToApoteka(state.token, input)

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

          setInput(initialState)

          handleClose()

          toast.success("Proizvod uspesno dodat u apoteku " + addedProduct.data.apoteka.nazivApoteke)

          navigate(`/apoteka/${addedProduct.data.apoteka.apotekaId}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <DialogWrapper
      open={dialogOpen}
      onClose={handleClose}
      title={isEdit ? 'Izmeni proizvod u apoteci' : 'Dodaj proizvod u apoteku'}
      showDefaultActions={true}
      onSubmit={handleSubmit}
      submitText={isEdit ? 'Sačuvaj' : 'Kreiraj'}
      cancelText="Odustani"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          autoFocus
          margin="dense"
          id="stock"
          label="Stanje zaliha"
          name="stanjeZaliha"
          type="text"
          fullWidth
          required
          value={input.stanjeZaliha}
          onChange={handleInputChange}
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="image"
          label="Slika proizvoda (URL)"
          name="slika"
          type="text"
          fullWidth
          value={input.slika}
          onChange={handleInputChange}
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="discount"
          label="Popust (u procentima)"
          name="popustUprocentima"
          type="text"
          fullWidth
          value={input.popustUprocentima}
          onChange={handleInputChange}
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="price"
          label="Cena bez popusta"
          name="cenaBezPopusta"
          type="text"
          fullWidth
          required
          value={input.cenaBezPopusta}
          onChange={handleInputChange}
          sx={{ marginBottom: '20px' }}
        />
        <Select
          labelId="Proizvodi"
          id="products"
          name="proizvodId"
          value={input.proizvodId}
          onChange={handleSelectChange}
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
          value={input.apotekaId}
          onChange={handleSelectChange}
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
      </Box>
    </DialogWrapper>
  )
}

export default ProductPharmacyDialog
