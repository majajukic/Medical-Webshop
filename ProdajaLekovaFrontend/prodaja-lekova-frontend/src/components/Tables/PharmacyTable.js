import React, { useState, useEffect } from 'react'
import { getApoteke } from '../../services/apotekaService'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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

const columns = [
  { id: 'apotekaId', label: 'ID', minWidth: 550 },
  { id: 'nazivApoteke', label: 'Naziv Apoteke', minWidth: 650 },
]

const PharmacyTable = () => {
  const theme = useTheme()
  const [apoteke, setApoteke] = useState([])

  useEffect(() => {
    console.log('apoteka useeffecr')
    getApoteke()
      .then((response) => {
        setApoteke(response.data)
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
        {apoteke.length > 0 && apoteke.map((apoteka) => (
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
  )
}

export default PharmacyTable
