import React, { useEffect, useState, memo } from 'react'
import { getApoteke, deleteApoteka } from '../../services/apotekaService'
import PharmacyDialog from '../Dialogs/PharmacyDialog'
import { Button, Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useApoteka } from '../../context/ApotekaContext'
import { GET_PHARMACIES, DELETE_PHARMACY } from '../../constants/actionTypes'
import GenericTable from '../Common/GenericTable'
import { toast } from 'react-toastify'
import { SPACING, DIMENSIONS } from '../../constants/themeConstants'

const columns = [
  { id: 'apotekaId', label: 'ID', minWidth: 550 },
  { id: 'nazivApoteke', label: 'Naziv Apoteke', minWidth: 650 },
]

const PharmacyTable = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedPharmacy, setSelectedPharmacy] = useState(null)
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

  const handleDelete = (apoteka) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu stavku?')) {
      deleteApoteka(apoteka.apotekaId, state.token)
        .then(() => {
          dispatch({ type: DELETE_PHARMACY, payload: apoteka.apotekaId })
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

  const handleEdit = (apoteka) => {
    setIsEdit(true)
    setSelectedPharmacy(apoteka)
    setDialogOpen(true)
  }

  return (
    <>
      <GenericTable
        columns={columns}
        data={apotekaState.apoteke}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Nema apoteka"
        getRowKey={(item) => item.apotekaId}
        minWidth={DIMENSIONS.TABLE_MIN_WIDTH}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'left',
          marginBottom: SPACING.VERY_LARGE,
          marginTop: SPACING.VERY_LARGE,
          marginLeft: SPACING.SMALL_PLUS,
        }}
      >
        <Button variant="contained" onClick={handleOpen}>
          Dodaj novu apoteku
        </Button>
      </Box>
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
    </>
  )
}

export default memo(PharmacyTable)
