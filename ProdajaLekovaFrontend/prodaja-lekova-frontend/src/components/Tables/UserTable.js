import React, { useState, useEffect, memo } from 'react'
import { Box, Button } from '@mui/material'
import { getKorisnici, deleteKorisnik } from '../../services/korisnikService'
import { useAuth } from '../../context/AuthContext'
import UserDialog from '../Dialogs/UserDialog'
import GenericTable from '../Common/GenericTable'
import { toast } from 'react-toastify'
import { SPACING, DIMENSIONS } from '../../constants/themeConstants'

const columns = [
  { id: 'korisnikId', label: 'ID', minWidth: 50 },
  { id: 'ime', label: 'Ime', minWidth: 100 },
  { id: 'prezime', label: 'Prezime', minWidth: 100 },
  { id: 'email', label: 'Mejl', minWidth: 100 },
  { id: 'brojTelefona', label: 'Telefon', minWidth: 100 },
  { id: 'ulica', label: 'Ulica', minWidth: 100 },
  { id: 'broj', label: 'Broj kuće/stana', minWidth: 100 },
  { id: 'mesto', label: 'Mesto', minWidth: 100 },
  { id: 'tipKorisnika', label: 'Tip korisnika', minWidth: 100 },
]

const UserTable = () => {
  const { state } = useAuth()
  const [korisnici, setKorisnici] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    getKorisnici(state.token)
      .then((response) => {
        setKorisnici(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [state.token])

  const handleDelete = (korisnik) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      deleteKorisnik(korisnik.korisnikId, state.token)
        .then(() => {
          setKorisnici(
            korisnici.filter((k) => k.korisnikId !== korisnik.korisnikId),
          )
          toast.success('Korisnik uspesno obrisan')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleOpen = () => {
    setDialogOpen(true)
  }

  const handleEdit = (korisnik) => {
    setIsEdit(true)
    setSelectedUser(korisnik)
    setDialogOpen(true)
  }

  const handleAddNewKorisnik = (newKorisnik) => {
    setKorisnici([...korisnici, newKorisnik])
  }

  const handleEditKorisnik = (korisnici) => {
    setKorisnici(korisnici)
  }

  const renderCell = (item, column) => {
    if (column.id === 'tipKorisnika') {
      return item.tipKorisnika === 0 ? 'Admin' : 'Kupac'
    }
    return item[column.id]
  }

  return (
    <>
      <GenericTable
        columns={columns}
        data={korisnici}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Nema korisnika"
        getRowKey={(item) => item.korisnikId}
        renderCell={renderCell}
        minWidth={DIMENSIONS.TABLE_MIN_WIDTH}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: SPACING.VERY_LARGE,
          marginTop: SPACING.VERY_LARGE,
          marginInlineStart: SPACING.SMALL_PLUS,
        }}
      >
        <Button variant="contained" onClick={handleOpen}>
          Dodaj novog korisnika
        </Button>
      </Box>
      {dialogOpen && !isEdit && (
        <UserDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onAddNew={handleAddNewKorisnik}
        />
      )}
      {dialogOpen && isEdit && (
        <UserDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          userToEdit={selectedUser}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          onEdit={handleEditKorisnik}
        />
      )}
    </>
  )
}

export default memo(UserTable)
