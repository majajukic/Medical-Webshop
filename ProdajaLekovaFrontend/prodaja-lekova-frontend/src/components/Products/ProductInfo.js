import React, { memo } from 'react'
import { CardContent, Typography } from '@mui/material'

const ProductInfo = ({ product }) => {
  return (
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="h2">
        {product.proizvod.nazivProizvoda}
      </Typography>
      <Typography>
        <strong>Tip: </strong>
        {product.proizvod.tipProizvoda.nazivTipaProizvoda}
      </Typography>
      <Typography>
        <strong>Proizvodjač: </strong>
        {product.proizvod.proizvodjac}
      </Typography>
      <Typography>
        <strong>Cena: </strong>{' '}
        {product.cenaBezPopusta.toLocaleString('sr-RS', {
          style: 'currency',
          currency: 'RSD',
        })}
      </Typography>
      {product.popustUprocentima && (
        <Typography sx={{ color: 'red' }}>
          <strong>Cena sa popustom: </strong>{' '}
          {product.cenaSaPopustom.toLocaleString('sr-RS', {
            style: 'currency',
            currency: 'RSD',
          })}
        </Typography>
      )}
      <Typography>
        <strong>Apoteka: </strong>
        {product.apoteka.nazivApoteke}
      </Typography>
      <Typography>
        <strong>Na stanju: </strong>
        {product.stanjeZaliha > 0
          ? product.stanjeZaliha
          : 'Trenutno nema na stanju'}
      </Typography>
    </CardContent>
  )
}

export default memo(ProductInfo)
