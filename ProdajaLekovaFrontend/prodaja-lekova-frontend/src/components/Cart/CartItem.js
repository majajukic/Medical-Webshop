import React from 'react'
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material'
import { useKorpa } from '../../context/KorpaContext'
import { useAuth } from '../../context/AuthContext'
import {
  deletePorudzbina,
  deleteStavka,
  getKorpa,
} from '../../services/porudzbinaService'
import { EMPTY_CART, REMOVE_ITEM, GET_CART } from '../../constants/actionTypes'

const CartItem = ({ item }) => {
  const { state: korpaState, dispatch: korpaDispatch } = useKorpa()
  const { state } = useAuth()

  const handleDelete = (stavkaId) => {
    if (korpaState.porudzbina.stavkaPorudzbine?.length === 1) {
      deletePorudzbina(korpaState.porudzbina.porudzbinaId, state.token)
        .then(() => {
          korpaDispatch({ type: EMPTY_CART })
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      deleteStavka(stavkaId, state.token)
        .then(() => {
          getKorpa(state.token)
          .then((response) => {
            korpaDispatch({ type: GET_CART, payload: response.data })
          })
          .catch((error) => {
            console.error(error)
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  return (
    <Card
      sx={{
        marginBottom: '16px',
        display: 'flex',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardMedia
        component="img"
        alt="slika"
        src={item.apotekaProizvod.slika}
        sx={{
          width: '150px',
          height: '150px',
          objectFit: 'cover',
          padding: '10px',
        }}
      />
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
          {item.apotekaProizvod.proizvod.nazivProizvoda}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Tip:</strong>{' '}
          {item.apotekaProizvod.proizvod.tipProizvoda.nazivTipaProizvoda}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Cena: </strong>
          {item.apotekaProizvod.cenaBezPopusta.toLocaleString('sr-RS', {
            style: 'currency',
            currency: 'RSD',
          })}
        </Typography>
        {item.apotekaProizvod.popustUprocentima && (
          <Typography variant="body2" color="red">
            <strong>Cena sa popustom: </strong>
            {item.apotekaProizvod.cenaSaPopustom.toLocaleString('sr-RS', {
              style: 'currency',
              currency: 'RSD',
            })}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          <strong>Količina: </strong> {item.kolicina}
        </Typography>
        <Button
          variant="outlined"
          sx={{ marginTop: '15px' }}
          onClick={() => handleDelete(item.stavkaId)}
        >
          Ukloni iz korpe
        </Button>
      </CardContent>
    </Card>
  )
}

export default CartItem
