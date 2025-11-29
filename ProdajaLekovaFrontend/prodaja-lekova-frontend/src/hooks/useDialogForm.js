import { useState, useEffect } from 'react'

export const useDialogForm = (initialState, itemToEdit, setIsEdit) => {
  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit)
      setIsEdit && setIsEdit(true)
    } else {
      setFormData(initialState)
    }
  }, [itemToEdit, initialState, setIsEdit])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name) => (e) => {
    setFormData({ ...formData, [name]: e.target.value })
  }

  const resetForm = () => {
    setFormData(initialState)
  }

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    resetForm,
  }
}
