import React, { memo } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { SPACING } from '../../constants/themeConstants'

export const PersonalInfoFields = memo(({ input, onChange }) => {
  return (
    <>
      <TextField
        autoComplete="given-name"
        name="ime"
        fullWidth
        id="firstName"
        label="Ime"
        autoFocus
        value={input.ime}
        onChange={onChange}
        sx={{ marginBottom: SPACING.LARGE }}
      />
      <TextField
        fullWidth
        id="lastName"
        label="Prezime"
        name="prezime"
        autoComplete="family-name"
        value={input.prezime}
        onChange={onChange}
        sx={{ marginBottom: SPACING.LARGE }}
      />
    </>
  )
})

PersonalInfoFields.displayName = 'PersonalInfoFields'

export const ContactFields = memo(({ input, onChange }) => {
  return (
    <>
      <TextField
        required
        fullWidth
        id="email"
        label="Email adresa"
        name="email"
        autoComplete="email"
        type="email"
        value={input.email}
        onChange={onChange}
        sx={{ marginBottom: SPACING.LARGE }}
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
        onChange={onChange}
        sx={{ marginBottom: SPACING.LARGE }}
      />
      <TextField
        fullWidth
        id="phoneNumber"
        label="Broj telefona"
        name="brojTelefona"
        autoComplete="phone-number"
        value={input.brojTelefona}
        onChange={onChange}
        sx={{ marginBottom: SPACING.LARGE }}
      />
    </>
  )
})

ContactFields.displayName = 'ContactFields'

export const AddressFields = memo(({ input, onChange }) => {
  return (
    <>
      <TextField
        fullWidth
        id="street"
        label="Ulica"
        name="ulica"
        autoComplete="street"
        value={input.ulica}
        onChange={onChange}
        sx={{ marginBottom: SPACING.LARGE }}
      />
      <TextField
        fullWidth
        id="houseNumber"
        label="Broj kuće/stana"
        name="broj"
        autoComplete="house-number"
        value={input.broj}
        onChange={onChange}
        sx={{ marginBottom: SPACING.LARGE }}
      />
      <TextField
        fullWidth
        id="city"
        label="Mesto stanovanja"
        name="mesto"
        autoComplete="city"
        value={input.mesto}
        onChange={onChange}
        sx={{ marginBottom: SPACING.LARGE }}
      />
    </>
  )
})

AddressFields.displayName = 'AddressFields'

export const UserTypeField = memo(({ value, onChange }) => {
  return (
    <Select
      labelId="Tip korisnika"
      id="user-type"
      name="tipKorisnika"
      value={value}
      onChange={onChange}
      sx={{ marginBottom: SPACING.LARGE }}
      fullWidth
      required
    >
      <MenuItem value={0}>Admin</MenuItem>
      <MenuItem value={1}>Kupac</MenuItem>
    </Select>
  )
})

UserTypeField.displayName = 'UserTypeField'
