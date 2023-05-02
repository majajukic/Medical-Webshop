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
import { createKorisnik } from '../../services/korisnikService'

const initialState = {
  ime: '',
  prezime: '',
  email: '',
  lozinka: '',
  brojTelefona: '',
  ulica: '',
  broj: '',
  mesto: '',
  tipKorisnika: 0,
}

const UserDialog = ({ dialogOpen, setDialogOpen, onAddNew }) => {
  const [input, setInput] = useState(initialState)
  const { state } = useAuth()

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e) => {
    setInput({ ...input, tipKorisnika: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await createKorisnik(state.token, input)

      if (response === 422) {
        alert('Lozinka mora imati minimum 8 karaktera - slova i brojeve.')
      } else if (response === 400) {
        alert('Korisnik sa datom mejl adresom vec postoji u bazi.')
      } else {
        onAddNew(response.data)

        setInput(initialState)

        handleClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={dialogOpen} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoComplete="given-name"
            name="ime"
            fullWidth
            id="firstName"
            label="Ime"
            autoFocus
            value={input.ime}
            onChange={handleInputChange}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            id="lastName"
            label="Prezime"
            name="prezime"
            autoComplete="family-name"
            value={input.prezime}
            onChange={handleInputChange}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            required
            fullWidth
            id="email"
            label="Email adresa"
            name="email"
            autoComplete="email"
            type="email"
            value={input.email}
            onChange={handleInputChange}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            required
            fullWidth
            name="lozinka"
            label="Lozinka"
            type="password"
            id="password"
            autoComplete="new-password"
            value={input.lozinka}
            onChange={handleInputChange}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            id="phoneNumber"
            label="Broj telefona"
            name="brojTelefona"
            autoComplete="phone-number"
            value={input.brojTelefona}
            onChange={handleInputChange}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            id="street"
            label="Ulica"
            name="ulica"
            autoComplete="street"
            value={input.ulica}
            onChange={handleInputChange}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            id="houseNumber"
            label="Broj kuće/stana"
            name="broj"
            autoComplete="house-number"
            value={input.broj}
            onChange={handleInputChange}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            id="city"
            label="Mesto stanovanja"
            name="mesto"
            autoComplete="city"
            value={input.mesto}
            onChange={handleInputChange}
            sx={{ marginBottom: '20px' }}
          />
          <Select
            labelId="Tip korisnika"
            id="user-type"
            name="tipKorisnika"
            value={input.tipKorisnika}
            onChange={handleSelectChange}
            sx={{ marginBottom: '20px' }}
            fullWidth
            required
          >
            <MenuItem value={0}>Admin</MenuItem>
            <MenuItem value={1}>Kupac</MenuItem>
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

export default UserDialog
