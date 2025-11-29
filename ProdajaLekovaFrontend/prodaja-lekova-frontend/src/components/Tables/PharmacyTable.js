import { useEffect } from 'react'
import { getApoteke, deleteApoteka } from '../../services/apotekaService'
import PharmacyDialog from '../Dialogs/PharmacyDialog'
import { useAuth } from '../../context/AuthContext'
import { useApoteka } from '../../context/ApotekaContext'
import { GET_PHARMACIES, DELETE_PHARMACY } from '../../constants/actionTypes'
import { toast } from 'react-toastify'
import BaseTable from './BaseTable'
import { useTableActions } from '../../hooks/useTableActions'

const columns = [
  { id: 'apotekaId', label: 'ID', minWidth: 100 },
  { id: 'nazivApoteke', label: 'Naziv Apoteke', minWidth: 300 },
]

const PharmacyTable = () => {
  const { state } = useAuth()
  const { state: apotekaState, dispatch } = useApoteka()
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
    getApoteke()
      .then((response) => {
        dispatch({ type: GET_PHARMACIES, payload: response.data })
      })
      .catch((error) => {
        console.error(error)
      })
  }, [dispatch])

  const onDelete = (pharmacy) => {
    handleDelete(pharmacy.apotekaId, (id) =>
      deleteApoteka(id, state.token).then(() => {
        dispatch({ type: DELETE_PHARMACY, payload: id })
        toast.success('Apoteka uspešno obrisana!')
      })
    )
  }

  return (
    <>
      <BaseTable
        columns={columns}
        data={apotekaState.apoteke.map((apoteka) => ({
          ...apoteka,
          id: apoteka.apotekaId,
        }))}
        onAdd={handleOpen}
        onEdit={handleEdit}
        onDelete={onDelete}
        addButtonLabel="Dodaj novu apoteku"
        emptyMessage="Nema apoteka"
      />
      <PharmacyDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        pharmacyToEdit={selectedItem}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
    </>
  )
}

export default PharmacyTable
