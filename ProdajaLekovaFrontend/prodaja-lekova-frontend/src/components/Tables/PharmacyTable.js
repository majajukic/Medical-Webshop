import React, { Fragment, useEffect } from 'react'
import { getApoteke, deleteApoteka } from '../../services/apotekaService'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Pagination from '../Pagination'
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

const columns = [
  { id: 'apotekaId', label: 'ID', minWidth: 550 },
  { id: 'nazivApoteke', label: 'Naziv Apoteke', minWidth: 650 },
]

const PharmacyTable = () => {
  const theme = useTheme()
  const { state } = useAuth()
  const { state: apotekaState, dispatch } = useApoteka()

  useEffect(() => {
    console.log('apoteka useeffecr')

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
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  return (
    <Fragment>
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
          {apotekaState.apoteke.length > 0 &&
            apotekaState.apoteke.map((apoteka) => (
              <TableRow key={apoteka.apotekaId}>
                <TableCell align="left">{apoteka.apotekaId}</TableCell>
                <TableCell align="left">{apoteka.nazivApoteke}</TableCell>
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
            ))}
        </TableBody>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-strat',
            alignItems: 'left',
            marginBottom: '50px',
            marginTop: '50px',
            marginLeft: '10px',
          }}
        >
          <Button variant="contained">Dodaj novu apoteku</Button>
        </Box>
      </Table>
      {apotekaState.apoteke.length > 9 && <Pagination />}
    </Fragment>
  )
}

export default PharmacyTable
