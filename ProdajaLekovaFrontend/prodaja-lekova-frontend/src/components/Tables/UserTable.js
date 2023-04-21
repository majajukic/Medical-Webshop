import React, { useState, useEffect } from 'react'
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
import { getKorisnici } from '../../services/korisnikService'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useAuth } from '../../context/AuthContext'

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

  useEffect(() => {
    console.log('korisnik useeffecr')
    getKorisnici(state.token)
      .then((response) => {
        setKorisnici(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
      <TableBody>
        {korisnici.length > 0 && korisnici.map((korisnik) => (
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
              <Button size="small">
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
              <Button size="small">
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
        ))}
      </TableBody>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '50px',
          marginTop: '50px',
          marginInlineStart: '10px',
        }}
      >
        <Button variant="contained">Dodaj novog korisnika</Button>
      </Box>
    </Table>
  )
}

export default UserTable
