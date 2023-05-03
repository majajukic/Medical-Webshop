import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Box,
} from '@mui/material'
import { useApoteka } from '../../context/ApotekaContext'
import { useAuth } from '../../context/AuthContext'
import {
  createApoteka,
  getApoteke,
  updateApoteka,
} from '../../services/apotekaService'
import { CREATE_PHARMACY, GET_PHARMACIES } from '../../constants/actionTypes'

const initialState = {
  apotekaId: null,
  nazivApoteke: '',
}

const PharmacyDialog = ({
  dialogOpen,
  setDialogOpen,
  pharmacyToEdit,
  isEdit,
  setIsEdit,
}) => {
  const [input, setInput] = useState(initialState)
  const { dispatch } = useApoteka()
  const { state } = useAuth()

  useEffect(() => {
    if (pharmacyToEdit) {
      setInput({
        apotekaId: pharmacyToEdit.apotekaId,
        nazivApoteke: pharmacyToEdit.nazivApoteke,
      })
      setIsEdit(true)
    }
  }, [pharmacyToEdit])

  const handleClose = () => {
    setDialogOpen(false)

    if (isEdit) {
      setIsEdit(false)
    }
  }

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    //const requestBody = { ...input }

    if (isEdit) {
      //requestBody.apotekaId = pharmacyToEdit.apotekaId
      const response = await updateApoteka(state.token, input)
      if (response.status === 200) {
        setInput(initialState)
        handleClose()
        getApoteke()
          .then((response) => {
            dispatch({ type: GET_PHARMACIES, payload: response.data })
          })
          .catch((error) => {
            console.error(error)
          })
      } else if (response === 400) {
        alert('Apoteka sa ovim nazivom već postoji u bazi.')
      }
    } else {
      const response = await createApoteka(state.token, input)

      if (response === 400) {
        alert('Apoteka sa ovim nazivom već postoji u bazi.')
      } else {
        dispatch({ type: CREATE_PHARMACY, payload: response.data })
        setInput(initialState)
        handleClose()
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
            id="pharmacy-name"
            label="Naziv apoteke"
            name="nazivApoteke"
            type="text"
            fullWidth
            required
            value={input.nazivApoteke}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Odustani
          </Button>
          <Button variant="contained" type="submit">
            {isEdit ? 'Sačuvaj' : 'Dodaj'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default PharmacyDialog
