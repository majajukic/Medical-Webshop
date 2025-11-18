import React, { useState, useEffect, memo } from 'react'
import { getProizvodi, deleteProizvod } from '../../services/proizvodService'
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
import { useAuth } from '../../context/AuthContext'
import ProductDialog from '../Dialogs/ProductDialog'
import ProductPharmacyDialog from '../Dialogs/ProductPharmacyDialog'
import { toast } from 'react-toastify'

const columns = [
  { id: 'proizvodId', label: 'ID', minWidth: 50 },
  { id: 'nazivProizvoda', label: 'Naziv Proizvoda', minWidth: 200 },
  { id: 'proizvodjac', label: 'Proizvodjač', minWidth: 200 },
  { id: 'tipProizvoda', label: 'Tip proizvoda', minWidth: 200 },
]

const ProductTable = () => {
  const theme = useTheme()
  const { state } = useAuth()
  const [proizvodi, setProizvodi] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [secondDialogOpen, setSecondDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    getProizvodi()
      .then((response) => {
        setProizvodi(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const handleDelete = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu stavku?')) {
      deleteProizvod(id, state.token)
        .then(() => {
          setProizvodi(
            proizvodi.filter((proizvod) => proizvod.proizvodId !== id),
          )
          toast.success('Proizvod uspesno obrisan!')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleOpen = () => {
    setDialogOpen(true)
  }

  const handleSecondOpen = () => {
    setSecondDialogOpen(true)
  }

  const handleIsEdit = (proizvod) => {
    setIsEdit(true)
    setSelectedProduct(proizvod)
    setDialogOpen(true)
  }

  const handleAddNewProizvod = (newProizvod) => {
    setProizvodi([...proizvodi, newProizvod])
  }

  const handleEditProizvod = (proizvodi) => {
    setProizvodi(proizvodi)
  }

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      {proizvodi.length > 0 && (
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
        {proizvodi.length > 0 ? (
          proizvodi.map((proizvod) => (
            <TableRow key={proizvod.proizvodId}>
              <TableCell align="left">{proizvod.proizvodId}</TableCell>
              <TableCell align="left">{proizvod.nazivProizvoda}</TableCell>
              <TableCell align="left">{proizvod.proizvodjac}</TableCell>
              <TableCell align="left">
                {proizvod.tipProizvoda.nazivTipaProizvoda}
              </TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleIsEdit(proizvod)}>
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
                  onClick={() => handleDelete(proizvod.proizvodId)}
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
            <TableCell>Nema proizvoda</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell colSpan={4}>
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
              <Button
                variant="contained"
                sx={{ marginRight: '10px' }}
                onClick={handleOpen}
              >
                Dodaj novi proizvod
              </Button>
              {dialogOpen && !isEdit && (
                <ProductDialog
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  onAddNew={handleAddNewProizvod}
                />
              )}
              <Button
                variant="contained"
                sx={{ marginRight: '10px' }}
                onClick={handleSecondOpen}
              >
                Dodaj proizvod u apoteku
              </Button>
              {secondDialogOpen && (
                <ProductPharmacyDialog
                  dialogOpen={secondDialogOpen}
                  setDialogOpen={setSecondDialogOpen}
                />
              )}
            </Box>
            {dialogOpen && isEdit && (
              <ProductDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                productToEdit={selectedProduct}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                onEdit={handleEditProizvod}
              />
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default memo(ProductTable)
