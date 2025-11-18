import React, { useState, useEffect, memo } from 'react'
import { getProizvodi, deleteProizvod } from '../../services/proizvodService'
import { Box, Button } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import ProductDialog from '../Dialogs/ProductDialog'
import ProductPharmacyDialog from '../Dialogs/ProductPharmacyDialog'
import GenericTable from '../Common/GenericTable'
import { toast } from 'react-toastify'
import { SPACING, DIMENSIONS } from '../../constants/themeConstants'

const columns = [
  { id: 'proizvodId', label: 'ID', minWidth: 50 },
  { id: 'nazivProizvoda', label: 'Naziv Proizvoda', minWidth: 200 },
  { id: 'proizvodjac', label: 'Proizvodjač', minWidth: 200 },
  { id: 'tipProizvoda', label: 'Tip proizvoda', minWidth: 200 },
]

const ProductTable = () => {
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

  const handleDelete = (proizvod) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu stavku?')) {
      deleteProizvod(proizvod.proizvodId, state.token)
        .then(() => {
          setProizvodi(
            proizvodi.filter((p) => p.proizvodId !== proizvod.proizvodId),
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

  const handleEdit = (proizvod) => {
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

  const renderCell = (item, column) => {
    if (column.id === 'tipProizvoda') {
      return item.tipProizvoda.nazivTipaProizvoda
    }
    return item[column.id]
  }

  return (
    <>
      <GenericTable
        columns={columns}
        data={proizvodi}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Nema proizvoda"
        getRowKey={(item) => item.proizvodId}
        renderCell={renderCell}
        minWidth={DIMENSIONS.TABLE_MIN_WIDTH}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: SPACING.VERY_LARGE,
          marginTop: SPACING.VERY_LARGE,
          marginLeft: SPACING.SMALL_PLUS,
        }}
      >
        <Button
          variant="contained"
          sx={{ marginRight: SPACING.SMALL_PLUS }}
          onClick={handleOpen}
        >
          Dodaj novi proizvod
        </Button>
        <Button
          variant="contained"
          sx={{ marginRight: SPACING.SMALL_PLUS }}
          onClick={handleSecondOpen}
        >
          Dodaj proizvod u apoteku
        </Button>
      </Box>
      {dialogOpen && !isEdit && (
        <ProductDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onAddNew={handleAddNewProizvod}
        />
      )}
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
      {secondDialogOpen && (
        <ProductPharmacyDialog
          dialogOpen={secondDialogOpen}
          setDialogOpen={setSecondDialogOpen}
        />
      )}
    </>
  )
}

export default memo(ProductTable)
