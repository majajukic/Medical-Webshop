import { useState } from 'react'

export const useTableActions = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleOpen = () => {
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
    setIsEdit(false)
    setSelectedItem(null)
  }

  const handleEdit = (item) => {
    setIsEdit(true)
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleDelete = async (id, deleteFunction, onSuccess) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu stavku?')) {
      try {
        await deleteFunction(id)
        onSuccess && onSuccess(id)
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  return {
    dialogOpen,
    setDialogOpen,
    isEdit,
    setIsEdit,
    selectedItem,
    setSelectedItem,
    handleOpen,
    handleClose,
    handleEdit,
    handleDelete,
  }
}
