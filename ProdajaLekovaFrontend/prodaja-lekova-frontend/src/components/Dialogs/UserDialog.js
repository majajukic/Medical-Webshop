import { useEffect } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import {
  createKorisnik,
  getKorisnici,
  getProfil,
  updateKorisnik,
} from '../../services/korisnikService'
import { toast } from 'react-toastify'
import BaseDialog from './BaseDialog'
import { useDialogForm } from '../../hooks/useDialogForm'

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
  const { state } = useAuth()

  // Combine userToEdit and profileToEdit into a single mapped item
  const itemToEdit = userToEdit || profileToEdit
  const itemToEditMapped = itemToEdit
    ? {
        korisnikId: itemToEdit.korisnikId,
        ime: itemToEdit.ime || '',
        prezime: itemToEdit.prezime || '',
        email: itemToEdit.email,
        lozinka: itemToEdit.lozinka,
        brojTelefona: itemToEdit.brojTelefona || '',
        ulica: itemToEdit.ulica || '',
        broj: itemToEdit.broj || '',
        mesto: itemToEdit.mesto || '',
        tipKorisnika: itemToEdit.tipKorisnika,
      }
    : null

  const { formData, handleInputChange, handleSelectChange, resetForm } =
    useDialogForm(initialState, itemToEditMapped, null)

  // Update edit flags when item changes
  useEffect(() => {
    if (userToEdit) {
      setIsEdit(true)
    } else if (profileToEdit) {
      setIsEditProfile(true)
    }
  }, [userToEdit, profileToEdit, setIsEdit, setIsEditProfile])

  const handleClose = () => {
    setDialogOpen(false)
    setIsEdit(false)
    setIsEditProfile(false)
    resetForm()
  }

  const getDialogTitle = () => {
    if (isEdit) return 'Izmeni korisnika'
    if (isEditProfile) return 'Izmeni profil'
    return 'Dodaj novog korisnika'
  }

  const refreshUserData = async () => {
    try {
      const response = await getKorisnici(state.token)
      onEdit(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const refreshProfileData = async () => {
    try {
      const response = await getProfil(state.token)
      onProfileEdit(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateSuccess = async () => {
    handleClose()
    if (isEdit) {
      await refreshUserData()
      toast.success('Korisnik uspešno ažuriran!')
    } else {
      await refreshProfileData()
      toast.success('Profil uspešno ažuriran!')
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await updateKorisnik(state.token, formData)
      if (response.status === 200) {
        await handleUpdateSuccess()
      } else if (response === 422) {
        toast.error('Lozinka mora imati minimum 8 karaktera - slova i brojeve.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Greška pri ažuriranju korisnika.')
    }
  }

  const handleCreate = async () => {
    try {
      const response = await createKorisnik(state.token, formData)

      if (response === 422) {
        toast.error('Lozinka mora imati minimum 8 karaktera - slova i brojeve.')
      } else if (response === 400) {
        toast.error('Korisnik sa datom mejl adresom vec postoji u bazi.')
      } else {
        onAddNew(response.data)
        handleClose()
        toast.success('Korisnik uspešno kreiran!')
      }
    } catch (error) {
      console.error(error)
      toast.error('Greška pri kreiranju korisnika.')
    }
  }

  const handleSubmit = async () => {
    if (isEdit || isEditProfile) {
      await handleUpdate()
    } else {
      await handleCreate()
    }
  }

  return (
    <BaseDialog
      open={dialogOpen}
      onClose={handleClose}
      title={getDialogTitle()}
      onSubmit={handleSubmit}
      submitLabel={isEdit || isEditProfile ? 'Sačuvaj' : 'Kreiraj'}
      cancelLabel="Odustani"
    >
      <TextField
        autoComplete="given-name"
        name="ime"
        fullWidth
        id="firstName"
        label="Ime"
        autoFocus
        value={formData.ime}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id="lastName"
        label="Prezime"
        name="prezime"
        autoComplete="family-name"
        value={formData.prezime}
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
        value={formData.email}
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
        value={formData.lozinka}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id="phoneNumber"
        label="Broj telefona"
        name="brojTelefona"
        autoComplete="phone-number"
        value={formData.brojTelefona}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id="street"
        label="Ulica"
        name="ulica"
        autoComplete="street"
        value={formData.ulica}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id="houseNumber"
        label="Broj kuće/stana"
        name="broj"
        autoComplete="house-number"
        value={formData.broj}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id="city"
        label="Mesto stanovanja"
        name="mesto"
        autoComplete="city"
        value={formData.mesto}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px' }}
      />
      {!isEditProfile && (
        <Select
          labelId="Tip korisnika"
          id="user-type"
          name="tipKorisnika"
          value={formData.tipKorisnika}
          onChange={handleSelectChange('tipKorisnika')}
          sx={{ marginBottom: '20px' }}
          fullWidth
          required
        >
          <MenuItem value={0}>Admin</MenuItem>
          <MenuItem value={1}>Kupac</MenuItem>
        </Select>
      )}
    </BaseDialog>
  )
}

export default UserDialog
