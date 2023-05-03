import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApoteka } from '../../context/ApotekaContext'
import { useProizvod } from '../../context/ProizvodContext'
import {
  getProizvodi,
  addProizvodToApoteka,
} from '../../services/proizvodService'
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
import { ADD_PRODUCT_TO_PHARMACY } from '../../constants/actionTypes'
import { getProizvodByApoteka } from '../../services/proizvodService'
import { useNavigate } from 'react-router-dom'

const initialState = {
  proizvodId: 0,
  apotekaId: 0,
  stanjeZaliha: '',
  slika: '',
  popustUprocentima: '',
  cenaBezPopusta: '',
  //cenaSaPopustom: 0,
}

const ProductPharmacyDialog = ({ dialogOpen, setDialogOpen, onAddNew }) => {
  const [input, setInput] = useState(initialState)
  const [proizvodi, setProizvodi] = useState([])
  const { state: apotekaState } = useApoteka()
  const { dispatch: proizvodiDispatch } = useProizvod()
  const { state } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('dropdown useeffect')
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
  }

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await addProizvodToApoteka(state.token, input)

      if (response === 422) {
        alert('Vrednost stanja zaliha, popusta i cene ne sme biti 0')
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

        navigate(`/apoteka/${addedProduct.data.apoteka.apotekaId}`)
        
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Dialog open={dialogOpen} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
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

export default ProductPharmacyDialog