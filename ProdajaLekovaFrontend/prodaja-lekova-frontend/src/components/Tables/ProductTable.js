import React, { useState, useEffect } from 'react'
import { getProizvodi, deleteProizvod } from '../../services/proizvodService'
import { Button, Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import ProductDialog from '../Dialogs/ProductDialog'
import ProductPharmacyDialog from '../Dialogs/ProductPharmacyDialog'
import { toast } from 'react-toastify'
import BaseTable from './BaseTable'
import { useTableActions } from '../../hooks/useTableActions'

const columns = [
  { id: 'proizvodId', label: 'ID', minWidth: 50 },
  { id: 'nazivProizvoda', label: 'Naziv Proizvoda', minWidth: 200 },
  { id: 'proizvodjac', label: 'Proizvodjač', minWidth: 200 },
  {
    id: 'tipProizvoda',
    label: 'Tip proizvoda',
    minWidth: 200,
    render: (value) => value.nazivTipaProizvoda,
  },
]

const ProductTable = () => {
  const { state } = useAuth()
  const [proizvodi, setProizvodi] = useState([])
  const [secondDialogOpen, setSecondDialogOpen] = useState(false)
  const {
    dialogOpen,
    setDialogOpen,
    isEdit,
    setIsEdit,
    selectedItem,
    handleOpen,
    handleEdit,
    handleDelete,
  } = useTableActions()

  useEffect(() => {
    getProizvodi()
      .then((response) => {
        setProizvodi(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const onDelete = async (product) => {
    const deleteAction = async (id) => {
      await deleteProizvod(id, state.token)
      setProizvodi(proizvodi.filter((proizvod) => proizvod.proizvodId !== id))
      toast.success('Proizvod uspešno obrisan!')
    }

    handleDelete(product.proizvodId, deleteAction)
  }

  const handleAddNewProizvod = (newProizvod) => {
    setProizvodi([...proizvodi, newProizvod])
  }

  const handleEditProizvod = (proizvodi) => {
    setProizvodi(proizvodi)
  }

  return (
    <>
      <BaseTable
        columns={columns}
        data={proizvodi.map((proizvod) => ({
          ...proizvod,
          id: proizvod.proizvodId,
        }))}
        onAdd={handleOpen}
        onEdit={handleEdit}
        onDelete={onDelete}
        addButtonLabel="Dodaj novi proizvod"
        emptyMessage="Nema proizvoda"
      />
      <Box sx={{ mt: 2, mb: 4 }}>
        <Button
          variant="outlined"
          onClick={() => setSecondDialogOpen(true)}
          sx={{ ml: 2 }}
        >
          Dodaj proizvod u apoteku
        </Button>
      </Box>
      <ProductDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        productToEdit={selectedItem}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        onAddNew={handleAddNewProizvod}
        onEdit={handleEditProizvod}
      />
      <ProductPharmacyDialog
        dialogOpen={secondDialogOpen}
        setDialogOpen={setSecondDialogOpen}
      />
    </>
  )
}

export default ProductTable
