import React, { useEffect, useState, memo } from 'react'
import { getApoteke, deleteApoteka } from '../../services/apotekaService'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PharmacyDialog from '../Dialogs/PharmacyDialog'
import {
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  useTheme,
  Box,
  Table,
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useApoteka } from '../../context/ApotekaContext'
import { GET_PHARMACIES, DELETE_PHARMACY } from '../../constants/actionTypes'
import { toast } from 'react-toastify'

const columns = [
  { id: 'apotekaId', label: 'ID', minWidth: 550 },
  { id: 'nazivApoteke', label: 'Naziv Apoteke', minWidth: 650 },
]

const PharmacyTable = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedPharmacy, setSelectedPharmacy] = useState(null)
  const theme = useTheme()
  const { state } = useAuth()
  const { state: apotekaState, dispatch } = useApoteka()

  useEffect(() => {
    getApoteke()
      .then((response) => {
        dispatch({ type: GET_PHARMACIES, payload: response.data })
      })
      .catch((error) => {
        console.error(error)
      })
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu stavku?')) {
      deleteApoteka(id, state.token)
        .then(() => {
          dispatch({ type: DELETE_PHARMACY, payload: id })

          toast.success('Apoteka uspesno obrisana!')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleOpen = () => {
    setDialogOpen(true)
  }

  const handleIsEdit = (apoteka) => {
    setIsEdit(true)
    setSelectedPharmacy(apoteka)
    setDialogOpen(true)
  }

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      {apotekaState.apoteke.length > 0 && (
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
        {apotekaState.apoteke.length > 0 ? (
          apotekaState.apoteke.map((apoteka) => (
            <TableRow key={apoteka.apotekaId}>
              <TableCell align="left">{apoteka.apotekaId}</TableCell>
              <TableCell align="left">{apoteka.nazivApoteke}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleIsEdit(apoteka)}>
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
                  onClick={() => handleDelete(apoteka.apotekaId)}
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
            <TableCell>Nema apoteka</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell colSpan={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'left',
                marginBottom: '50px',
                marginTop: '50px',
                marginLeft: '10px',
              }}
            >
              <Button variant="contained" onClick={handleOpen}>
                Dodaj novu apoteku
              </Button>
              {dialogOpen && !isEdit && (
                <PharmacyDialog
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                />
              )}
              {dialogOpen && isEdit && (
                <PharmacyDialog
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  pharmacyToEdit={selectedPharmacy}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                />
              )}
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default memo(PharmacyTable)
