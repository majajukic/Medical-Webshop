import React, { Fragment, useState } from 'react'
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
import { createApoteka } from '../../services/apotekaService'
import { CREATE_PHARMACY } from '../../constants/actionTypes'

const initialState = {
  nazivApoteke: '',
}

const PharmacyDialog = ({ dialogOpen, setDialogOpen }) => {
  const [input, setInput] = useState(initialState)
  const { dispatch } = useApoteka()
  const { state } = useAuth()

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await createApoteka(state.token, input)

    if (response === 400) {
      alert('Apoteka sa ovim nazivom već postoji u bazi.')
    } else {
      dispatch({ type: CREATE_PHARMACY, payload: response.data })
      setInput(initialState)
      handleClose()
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

export default PharmacyDialog
