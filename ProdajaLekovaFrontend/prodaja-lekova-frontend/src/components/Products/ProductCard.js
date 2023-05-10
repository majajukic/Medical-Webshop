import React, { Fragment, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { getUserRole } from '../../utilities/authUtilities'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  useTheme,
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

const ProductCard = ({ proizvodProp }) => {
  const theme = useTheme()
  const [quantity, setQuantity] = useState(1)
  const [isEdit, setIsEdit] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { dispatch: proizvodiDispatch } = useProizvod()
  const { state: korpaState, dispatch: korpaDispatch } = useKorpa()
  const { state } = useAuth()
  const role = getUserRole()

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value)
  }

  const handleIsEdit = () => {
    setIsEdit(true)
    setDialogOpen(true)
  }

  const handleDelete = (apotekaId) => {
    if (
      window.confirm(
        'Da li ste sigurni da želite da obrišete ovaj proizvod iz date apoteke?',
      )
    ) {
      deleteProizvodFromApoteka(apotekaId, state.token)
        .then(() => {
          proizvodiDispatch({ type: DELETE_PRODUCT, payload: apotekaId })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleAddToCart = (kolicina, cena, popust, apotekaProizvodId) => {
    if (
      !korpaState?.porudzbina || 
      Object.keys(korpaState?.porudzbina)?.length === 0 || 
      !korpaState?.porudzbina?.stavkaPorudzbine?.length
    ) {
      console.log('cart empty')
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
            alert('Proizvoda nema dovoljno na stanju za naručiti.')
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
      console.log('cart not empty')
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
            alert('Proizvoda nema dovoljno na stanju za naručiti.')
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
  }

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
        sx={{
          pt: '5%',
        }}
        src={proizvodProp.slika ? proizvodProp.slika : defaultImage }
        alt="slika proizvoda"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {proizvodProp.proizvod.nazivProizvoda}
        </Typography>
        <Typography>
          <strong>Tip: </strong>
          {proizvodProp.proizvod.tipProizvoda.nazivTipaProizvoda}
        </Typography>
        <Typography>
          <strong>Proizvodjač: </strong>
          {proizvodProp.proizvod.proizvodjac}
        </Typography>
        <Typography>
          <strong>Cena: </strong>{' '}
          {proizvodProp.cenaBezPopusta.toLocaleString('sr-RS', {
            style: 'currency',
            currency: 'RSD',
          })}
        </Typography>
        {proizvodProp.popustUprocentima && (
          <Typography sx={{ color: 'red' }}>
            <strong>Cena sa popustom: </strong>{' '}
            {proizvodProp.cenaSaPopustom.toLocaleString('sr-RS', {
              style: 'currency',
              currency: 'RSD',
            })}
          </Typography>
        )}
        <Typography>
          <strong>Apoteka: </strong>
          {proizvodProp.apoteka.nazivApoteke}
        </Typography>
        <Typography>
          <strong>Na stanju: </strong>
          {proizvodProp.stanjeZaliha > 0
            ? proizvodProp.stanjeZaliha
            : 'Trenutno nema na stanju'}
        </Typography>
        {role === 'Kupac' && (
          <TextField
            label="Količina"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: 1,
              max: proizvodProp.stanjeZaliha,
            }}
            value={quantity}
            onChange={handleQuantityChange}
            sx={{ mt: 2, width: '50%' }}
          />
        )}
      </CardContent>
      <CardActions sx={{ mt: 1 }}>
        {role === 'Admin' && (
          <Fragment>
            <Button size="small" onClick={handleIsEdit}>
              <EditIcon
                sx={{ marginRight: 1, color: theme.palette.primary.main }}
              />
            </Button>
            {dialogOpen && isEdit && (
              <ProductPharmacyDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                productToEdit={proizvodProp}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
              />
            )}
            <Button
              size="small"
              onClick={() => handleDelete(proizvodProp.apotekaProizvodId)}
            >
              <DeleteIcon
                sx={{ marginRight: 1, color: theme.palette.primary.main }}
              />
            </Button>
          </Fragment>
        )}
        {role === 'Kupac' &&
          (proizvodProp.stanjeZaliha > 0 ? (
            <Button
              size="medium"
              variant="contained"
              onClick={() =>
                handleAddToCart(
                  quantity,
                  proizvodProp.cenaBezPopusta,
                  proizvodProp.popustUprocentima,
                  proizvodProp.apotekaProizvodId,
                )
              }
            >
              Dodaj u korpu
            </Button>
          ) : (
            <Typography>Proizvoda trenutno nema na stanju.</Typography>
          ))}
      </CardActions>
    </Card>
  )
}

export default ProductCard
