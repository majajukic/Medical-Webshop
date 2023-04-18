import React, { useState } from 'react'
import previewImage from '../../assets/image-preview.png'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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

const ProductCard = () => {
  
  const theme = useTheme()
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value)
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
        image={previewImage}
        alt="random"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          Persen
        </Typography>
        <Typography>
          <strong>Tip:</strong> Lek
        </Typography>
        <Typography>
          <strong>Proizcodjač:</strong> Galenika
        </Typography>
        <Typography>
          <strong>Cena:</strong> 350din
        </Typography>
        <TextField
          label="Količina"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={quantity}
          onChange={handleQuantityChange}
          sx={{ mt: 2, width: '50%' }}
        />
      </CardContent>
      <CardActions sx={{ mt: 1 }}>
        <Button size="small">
          <EditIcon
            sx={{ marginRight: 1, color: theme.palette.primary.main }}
          />
        </Button>
        <Button size="small">
          <DeleteIcon
            sx={{ marginRight: 1, color: theme.palette.primary.main }}
          />
        </Button>
        <Button size="medium" variant="contained">
          Dodaj u korpu
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard
