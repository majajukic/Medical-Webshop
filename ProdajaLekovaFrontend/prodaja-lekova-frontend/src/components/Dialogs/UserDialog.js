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
  createKorisnik,
  getKorisnici,
  getProfil,
  updateKorisnik,
} from '../../services/korisnikService'

const initialState = {
  korisnikId: null,
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

const UserDialog = ({
  dialogOpen,
  setDialogOpen,
  onAddNew,
  onEdit,
  onProfileEdit,
  profileToEdit,
  userToEdit,
  isEdit,
  setIsEdit,
  isEditProfile,
  setIsEditProfile,
}) => {
  const [input, setInput] = useState(initialState)
  const { state } = useAuth()

  useEffect(() => {
    if (userToEdit) {
      setInput({
        korisnikId: userToEdit.korisnikId,
        ime: userToEdit.ime || '',
        prezime: userToEdit.prezime || '',
        email: userToEdit.email,
        lozinka: userToEdit.lozinka,
        brojTelefona: userToEdit.brojTelefona || '',
        ulica: userToEdit.ulica || '',
        broj: userToEdit.broj || '',
        mesto: userToEdit.mesto || '',
        tipKorisnika: userToEdit.tipKorisnika,
      })
      setIsEdit(true)
    } else if (profileToEdit) {
      setInput({
        korisnikId: profileToEdit.korisnikId,
        ime: profileToEdit.ime || '',
        prezime: profileToEdit.prezime || '',
        email: profileToEdit.email,
        lozinka: profileToEdit.lozinka,
        brojTelefona: profileToEdit.brojTelefona || '',
        ulica: profileToEdit.ulica || '',
        broj: profileToEdit.broj || '',
        mesto: profileToEdit.mesto || '',
        tipKorisnika: profileToEdit.tipKorisnika,
      })
      setIsEditProfile(true)
    }
  }, [userToEdit, profileToEdit])

  const handleClose = () => {
    setDialogOpen(false)

    if (isEdit) {
      setIsEdit(false)
    } else if (isEditProfile) {
      setIsEditProfile(false)
    }
  }

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e) => {
    setInput({ ...input, tipKorisnika: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isEdit || isEditProfile) {
      try {
        const response = await updateKorisnik(state.token, input)
        if (response.status === 200) {
          setInput(initialState)
          handleClose()

          if (isEdit) {
            getKorisnici(state.token)
              .then((response) => {
                onEdit(response.data)
              })
              .catch((error) => {
                console.error(error)
              })
          } else {
            getProfil(state.token)
              .then((response) => {
                onProfileEdit(response.data)
              })
              .catch((error) => {
                console.error(error)
              })
          }
        } else if (response === 422) {
          alert('Lozinka mora imati minimum 8 karaktera - slova i brojeve.')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
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
          {!isEditProfile && (
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Odustani
          </Button>
          <Button variant="contained" type="submit">
            {isEdit || isEditProfile ? 'Sačuvaj' : 'Kreiraj'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default UserDialog
