import React, { useState, useEffect, memo } from 'react'
import {
  Box,
  Button,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  Table,
} from '@mui/material'
import { getKorisnici, deleteKorisnik } from '../../services/korisnikService'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useAuth } from '../../context/AuthContext'
import UserDialog from '../Dialogs/UserDialog'
import { toast } from 'react-toastify'

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
  const theme = useTheme()
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

  const handleDelete = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      deleteKorisnik(id, state.token)
        .then(() => {
          setKorisnici(
            korisnici.filter((korisnik) => korisnik.korisnikId !== id),
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

  const handleIsEdit = (korisnik) => {
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

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      {korisnici.length > 0 && (
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align="left"
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {korisnici.length > 0 ? (
          korisnici.map((korisnik) => (
            <TableRow key={korisnik.korisnikId}>
              <TableCell align="left">{korisnik.korisnikId}</TableCell>
              <TableCell align="left">{korisnik.ime}</TableCell>
              <TableCell align="left">{korisnik.prezime}</TableCell>
              <TableCell align="left">{korisnik.email}</TableCell>
              <TableCell align="left">{korisnik.brojTelefona}</TableCell>
              <TableCell align="left">{korisnik.ulica}</TableCell>
              <TableCell align="left">{korisnik.broj}</TableCell>
              <TableCell align="left">{korisnik.mesto}</TableCell>
              <TableCell align="left">
                {korisnik.tipKorisnika === 0 ? 'Admin' : 'Kupac'}
              </TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleIsEdit(korisnik)}>
                  <EditIcon
                    sx={{
                      marginRight: 1,
                      color: theme.palette.primary.main,
                      fontSize: '2rem',
                    }}
                  />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => handleDelete(korisnik.korisnikId)}
                >
                  <DeleteIcon
                    sx={{
                      marginRight: 1,
                      color: theme.palette.primary.main,
                      fontSize: '2rem',
                    }}
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow variant="subtitle2">
            <TableCell>Nema korisnika</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell colSpan={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '50px',
                marginTop: '50px',
                marginInlineStart: '10px',
              }}
            >
              <Button variant="contained" onClick={handleOpen}>
                Dodaj novog korisnika
              </Button>
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
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default memo(UserTable)
