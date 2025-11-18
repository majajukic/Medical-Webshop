import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import { useApoteka } from '../../context/ApotekaContext'
import { useAuth } from '../../context/AuthContext'
import DialogWrapper from '../Common/DialogWrapper'
import {
  createApoteka,
  getApoteke,
  updateApoteka,
} from '../../services/apotekaService'
import { CREATE_PHARMACY, GET_PHARMACIES } from '../../constants/actionTypes'
import { toast } from 'react-toastify'

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

  const handleSubmit = async () => {
    if (isEdit) {
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
        toast.error('Apoteka sa ovim nazivom već postoji u bazi.')
      }
    } else {
      const response = await createApoteka(state.token, input)

      if (response === 400) {
        toast.error('Apoteka sa ovim nazivom već postoji u bazi.')
      } else {
        dispatch({ type: CREATE_PHARMACY, payload: response.data })
        setInput(initialState)
        handleClose()
      }
    }
  }

  return (
    <DialogWrapper
      open={dialogOpen}
      onClose={handleClose}
      title={isEdit ? 'Izmeni apoteku' : 'Dodaj novu apoteku'}
      onSubmit={handleSubmit}
      showDefaultActions={true}
      submitText={isEdit ? 'Sačuvaj' : 'Dodaj'}
      cancelText="Odustani"
    >
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
    </DialogWrapper>
  )
}

export default PharmacyDialog
