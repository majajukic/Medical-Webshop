import { TextField } from '@mui/material'
import { useApoteka } from '../../context/ApotekaContext'
import { useAuth } from '../../context/AuthContext'
import {
  createApoteka,
  getApoteke,
  updateApoteka,
} from '../../services/apotekaService'
import { CREATE_PHARMACY, GET_PHARMACIES } from '../../constants/actionTypes'
import { toast } from 'react-toastify'
import BaseDialog from './BaseDialog'
import { useDialogForm } from '../../hooks/useDialogForm'

const initialState = {
  apotekaId: null,
  nazivApoteke: '',
}

const PharmacyDialog = ({
  dialogOpen,
  setDialogOpen,
  pharmacyToEdit,
  isEdit,
  setIsEdit,
}) => {
  const { formData, handleInputChange, resetForm } = useDialogForm(
    initialState,
    pharmacyToEdit,
    setIsEdit
  )
  const { dispatch } = useApoteka()
  const { state } = useAuth()

  const handleClose = () => {
    setDialogOpen(false)
    setIsEdit(false)
    resetForm()
  }

  const handleSubmit = async () => {
    if (isEdit) {
      await updateApoteka(state.token, formData)
      handleClose()
      const apoteke = await getApoteke()
      dispatch({ type: GET_PHARMACIES, payload: apoteke.data })
      toast.success('Apoteka uspešno ažurirana!')
    } else {
      const response = await createApoteka(state.token, formData)
      dispatch({ type: CREATE_PHARMACY, payload: response.data })
      handleClose()
      toast.success('Apoteka uspešno kreirana!')
    }
  }

  return (
    <BaseDialog
      open={dialogOpen}
      onClose={handleClose}
      title={isEdit ? 'Izmeni apoteku' : 'Dodaj novu apoteku'}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Sačuvaj' : 'Dodaj'}
      cancelLabel="Odustani"
    >
      <TextField
        autoFocus
        margin="dense"
        id="pharmacy-name"
        label="Naziv apoteke"
        name="nazivApoteke"
        type="text"
        fullWidth
        required
        value={formData.nazivApoteke}
        onChange={handleInputChange}
      />
    </BaseDialog>
  )
}

export default PharmacyDialog
