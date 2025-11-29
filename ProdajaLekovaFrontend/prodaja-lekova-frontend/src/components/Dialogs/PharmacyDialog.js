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
      const response = await updateApoteka(state.token, formData)
      if (response.status === 200) {
        handleClose()
        getApoteke()
          .then((response) => {
            dispatch({ type: GET_PHARMACIES, payload: response.data })
          })
          .catch((error) => {
            console.error(error)
          })
        toast.success('Apoteka uspešno ažurirana!')
      } else if (response === 400) {
        toast.error('Apoteka sa ovim nazivom već postoji u bazi.')
      }
    } else {
      const response = await createApoteka(state.token, formData)

      if (response === 400) {
        toast.error('Apoteka sa ovim nazivom već postoji u bazi.')
      } else {
        dispatch({ type: CREATE_PHARMACY, payload: response.data })
        handleClose()
        toast.success('Apoteka uspešno kreirana!')
      }
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
