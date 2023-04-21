import React, { useState, useEffect } from 'react'
import { getProizvodi } from '../../services/proizvodService'
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
  { id: 'proizvodId', label: 'ID', minWidth: 50 },
  { id: 'nazivProizvoda', label: 'Naziv Proizvoda', minWidth: 200 },
  { id: 'proizvodjac', label: 'Proizvodjač', minWidth: 200 },
  { id: 'tipProizvoda', label: 'Tip proizvoda', minWidth: 200 },
]

const ProductTable = () => {
  const theme = useTheme()
  const [proizvodi, setProizvodi] = useState([])

  useEffect(() => {
    console.log('proizvod useeffecr')
    getProizvodi()
      .then((response) => {
        setProizvodi(response.data)
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
        {proizvodi.length > 0 && proizvodi.map((proizvod) => (
          <TableRow key={proizvod.proizvodId}>
            <TableCell align="left">{proizvod.proizvodId}</TableCell>
            <TableCell align="left">{proizvod.nazivProizvoda}</TableCell>
            <TableCell align="left">{proizvod.proizvodjac}</TableCell>
            <TableCell align="left">
              {proizvod.tipProizvoda.nazivTipaProizvoda}
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
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: '50px',
          marginTop: '50px',
          marginLeft: '10px',
        }}
      >
        <Button variant="contained" sx={{ marginRight: '10px' }}>
          Dodaj novi proizvod
        </Button>
        <Button variant="contained" sx={{ marginRight: '10px' }}>
          Dodaj novi tip proizvoda
        </Button>
        <Button variant="contained" sx={{ marginRight: '10px' }}>
          Dodaj proizvod u apoteku
        </Button>
      </Box>
    </Table>
  )
}

export default ProductTable
