import React, { Fragment, useState } from 'react'
import previewImage from '../../assets/image-preview.png'
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
import { deleteProizvod } from '../../services/proizvodService'
import { useAuth } from '../../context/AuthContext'
import { DELETE_PRODUCT } from '../../constants/actionTypes'

const ProductCard = ({ proizvodProp }) => {
  const theme = useTheme()
  const [quantity, setQuantity] = useState(1)
  const { dispatch: proizvodiDispatch } = useProizvod()
  const { state } = useAuth()
  const role = getUserRole()

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value)
  }

  const handleDelete = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj proizvod iz date apoteke?')) {
      deleteProizvod(id, state.token)
        .then(() => {
          proizvodiDispatch({ type: DELETE_PRODUCT, payload: id })
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
        src={proizvodProp.slika}
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
          <Typography sx={{color: 'red'}}>
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
        {role === 'Kupac' && (
          <TextField
            label="Količina"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: 1,
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
            <Button size="small">
              <EditIcon
                sx={{ marginRight: 1, color: theme.palette.primary.main }}
              />
            </Button>
            <Button size="small" onClick={() => handleDelete(proizvodProp.apotekaProizvodId)}>
              <DeleteIcon
                sx={{ marginRight: 1, color: theme.palette.primary.main }}
              />
            </Button>
          </Fragment>
        )}
        {role === 'Kupac' && (
          <Button size="medium" variant="contained">
            Dodaj u korpu
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default ProductCard
