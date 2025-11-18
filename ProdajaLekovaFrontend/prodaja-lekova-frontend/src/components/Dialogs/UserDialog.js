import React, { useState, useEffect } from 'react'
import { Button, Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import {
  createKorisnik,
  getKorisnici,
  getProfil,
  updateKorisnik,
} from '../../services/korisnikService'
import { toast } from 'react-toastify'
import DialogWrapper from '../Common/DialogWrapper'
import {
  PersonalInfoFields,
  ContactFields,
  AddressFields,
  UserTypeField,
} from '../Common/UserFormFields'

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
          toast.error('Lozinka mora imati minimum 8 karaktera - slova i brojeve.')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const response = await createKorisnik(state.token, input)

        if (response === 422) {
          toast.error('Lozinka mora imati minimum 8 karaktera - slova i brojeve.')
        } else if (response === 400) {
          toast.error('Korisnik sa datom mejl adresom vec postoji u bazi.')
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
    <DialogWrapper
      open={dialogOpen}
      onClose={handleClose}
      title={isEdit || isEditProfile ? 'Izmeni korisnika' : 'Dodaj novog korisnika'}
      showDefaultActions={true}
      onSubmit={handleSubmit}
      submitText={isEdit || isEditProfile ? 'Sačuvaj' : 'Kreiraj'}
      cancelText="Odustani"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <PersonalInfoFields input={input} onChange={handleInputChange} />
        <ContactFields input={input} onChange={handleInputChange} />
        <AddressFields input={input} onChange={handleInputChange} />
        {!isEditProfile && (
          <UserTypeField value={input.tipKorisnika} onChange={handleSelectChange} />
        )}
      </Box>
    </DialogWrapper>
  )
}

export default UserDialog
