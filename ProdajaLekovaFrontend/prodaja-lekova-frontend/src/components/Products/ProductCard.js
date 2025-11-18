import React, { Fragment, useState, memo, useCallback } from 'react'
import { getUserRole } from '../../utilities/authUtilities'
import {
  Card,
  CardMedia,
  CardActions,
} from '@mui/material'
import { useProizvod } from '../../context/ProizvodContext'
import { deleteProizvodFromApoteka } from '../../services/proizvodService'
import {
  createPorudzbina,
  addStavkaToPorudzbina,
  getKorpa,
} from '../../services/porudzbinaService'
import { useAuth } from '../../context/AuthContext'
import { DELETE_PRODUCT, GET_CART } from '../../constants/actionTypes'
import ProductPharmacyDialog from '../Dialogs/ProductPharmacyDialog'
import { useKorpa } from '../../context/KorpaContext'
import defaultImage from '../../assets/defaultImage.jpg'
import { toast } from 'react-toastify'
import ProductInfo from './ProductInfo'
import AddToCartSection from './AddToCartSection'
import ProductAdminActions from './ProductAdminActions'
import { SPACING } from '../../constants/themeConstants'

const ProductCard = ({ proizvodProp }) => {
  const [quantity, setQuantity] = useState(1)
  const [isEdit, setIsEdit] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { dispatch: proizvodiDispatch } = useProizvod()
  const { state: korpaState, dispatch: korpaDispatch } = useKorpa()
  const { state } = useAuth()
  const role = getUserRole()

  const handleQuantityChange = useCallback((event) => {
    setQuantity(event.target.value)
  }, [])

  const handleIsEdit = useCallback(() => {
    setIsEdit(true)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback((apotekaId) => {
    if (
      window.confirm(
        'Da li ste sigurni da želite da obrišete ovaj proizvod iz date apoteke?',
      )
    ) {
      deleteProizvodFromApoteka(apotekaId, state.token)
        .then(() => {
          proizvodiDispatch({ type: DELETE_PRODUCT, payload: apotekaId })

          toast.success('Proizvod uspesno obrisan!')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [proizvodiDispatch, state.token])

  const handleAddToCart = useCallback(() => {
    const kolicina = quantity
    const cena = proizvodProp.cenaBezPopusta
    const popust = proizvodProp.popustUprocentima
    const apotekaProizvodId = proizvodProp.apotekaProizvodId

    if (
      !korpaState?.porudzbina || 
      Object.keys(korpaState?.porudzbina)?.length === 0 || 
      !korpaState?.porudzbina?.stavkaPorudzbine?.length
    ) {
      const newPorudzbina = {
        brojPorudzbine: null,
        datumKreiranja: null,
        ukupanIznos: null,
        placenaPorudzbina: null,
        datumPlacanja: null,
        uplataId: null,
        kolicina: kolicina,
        cena: cena,
        popust: popust,
        apotekaProizvodId: apotekaProizvodId,
      }

      createPorudzbina(newPorudzbina, state.token)
        .then((response) => {
          if (response === 400) {
            toast.error('Proizvoda nema dovoljno na stanju za naručiti.')
          } else if(response === 422) {
            toast.error("Kolicina proizvoda za poruciti mora biti veca od 0.")
          } else if (response.status === 201) {
            getKorpa(state.token)
              .then((response) => {
                korpaDispatch({ type: GET_CART, payload: response.data })
              })
              .catch((error) => {
                console.error(error)
              })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      const stavkaToAdd = {
        kolicina: kolicina,
        cena: cena,
        popust: popust,
        porudzbinaId: korpaState.porudzbina.porudzbinaId,
        apotekaProizvodId: apotekaProizvodId,
      }

      addStavkaToPorudzbina(stavkaToAdd, state.token)
        .then((response) => {
          if (response === 400) {
            toast.error('Proizvoda nema dovoljno na stanju za naručiti.')
          } else if(response === 422) {
            toast.error("Kolicina proizvoda za poruciti mora biti veca od 0.")
          } else if (response.status === 201) {
            getKorpa(state.token)
              .then((response) => {
                korpaDispatch({ type: GET_CART, payload: response.data })
              })
              .catch((error) => {
                console.error(error)
              })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [quantity, proizvodProp, korpaState.porudzbina, state.token, korpaDispatch])

  return (
    <Card
      sx={{
        height: '100%',
        width: '150%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <CardMedia
        component="img"
        sx={{ pt: SPACING.TINY }}
        src={proizvodProp.slika ? proizvodProp.slika : defaultImage }
        alt="slika proizvoda"
      />
      <ProductInfo product={proizvodProp} />
      {role === 'Kupac' && proizvodProp.stanjeZaliha > 0 && (
        <AddToCartSection
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          maxQuantity={proizvodProp.stanjeZaliha}
        />
      )}
      <CardActions sx={{ mt: 1 }}>
        {role === 'Admin' && (
          <Fragment>
            <ProductAdminActions
              onEdit={handleIsEdit}
              onDelete={() => handleDelete(proizvodProp.apotekaProizvodId)}
            />
            {dialogOpen && isEdit && (
              <ProductPharmacyDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                productToEdit={proizvodProp}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
              />
            )}
          </Fragment>
        )}
      </CardActions>
    </Card>
  )
}

export default memo(ProductCard)
