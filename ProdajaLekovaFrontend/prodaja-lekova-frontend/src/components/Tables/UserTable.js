import React, { useState, useEffect } from 'react'
import { getKorisnici, deleteKorisnik } from '../../services/korisnikService'
import { useAuth } from '../../context/AuthContext'
import UserDialog from '../Dialogs/UserDialog'
import { toast } from 'react-toastify'
import BaseTable from './BaseTable'
import { useTableActions } from '../../hooks/useTableActions'

const columns = [
  { id: 'korisnikId', label: 'ID', minWidth: 50 },
  { id: 'ime', label: 'Ime', minWidth: 100 },
  { id: 'prezime', label: 'Prezime', minWidth: 100 },
  { id: 'email', label: 'Mejl', minWidth: 100 },
  { id: 'brojTelefona', label: 'Telefon', minWidth: 100 },
  { id: 'ulica', label: 'Ulica', minWidth: 100 },
  { id: 'broj', label: 'Broj kuće/stana', minWidth: 100 },
  { id: 'mesto', label: 'Mesto', minWidth: 100 },
  {
    id: 'tipKorisnika',
    label: 'Tip korisnika',
    minWidth: 100,
    render: (value) => (value === 0 ? 'Admin' : 'Kupac'),
  },
]

const UserTable = () => {
  const { state } = useAuth()
  const [korisnici, setKorisnici] = useState([])
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
    getKorisnici(state.token)
      .then((response) => {
        setKorisnici(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [state.token])

  const onDelete = async (user) => {
    const deleteAction = async (id) => {
      await deleteKorisnik(id, state.token)
      setKorisnici(korisnici.filter((korisnik) => korisnik.korisnikId !== id))
      toast.success('Korisnik uspešno obrisan!')
    }

    handleDelete(user.korisnikId, deleteAction)
  }

  const handleAddNewKorisnik = (newKorisnik) => {
    setKorisnici([...korisnici, newKorisnik])
  }

  const handleEditKorisnik = (korisnici) => {
    setKorisnici(korisnici)
  }

  return (
    <>
      <BaseTable
        columns={columns}
        data={korisnici.map((korisnik) => ({
          ...korisnik,
          id: korisnik.korisnikId,
        }))}
        onAdd={handleOpen}
        onEdit={handleEdit}
        onDelete={onDelete}
        addButtonLabel="Dodaj novog korisnika"
        emptyMessage="Nema korisnika"
      />
      <UserDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        userToEdit={selectedItem}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        onAddNew={handleAddNewKorisnik}
        onEdit={handleEditKorisnik}
      />
    </>
  )
}

export default UserTable
