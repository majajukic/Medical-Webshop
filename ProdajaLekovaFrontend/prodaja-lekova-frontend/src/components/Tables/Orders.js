import React, { Fragment, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getUserRole } from '../../utilities/authUtilities'
import {
  getPorudzbine,
  getPorudzbineByKupac,
} from '../../services/porudzbinaService'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Typography,
  Table,
  Grid,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material'
import Pagination from '../Pagination'
import { useAuth } from '../../context/AuthContext'

const Orders = () => {
  const role = getUserRole()
  const { state } = useAuth()
  const theme = useTheme()
  const [porudzbine, setPorudzbine] = useState([])

  useEffect(() => {
    if (role === 'Admin') {
      console.log('porudzbine useeffecr')
      getPorudzbine(state.token)
        .then((response) => {
          setPorudzbine(response.data)
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (role === 'Kupac') {
      console.log('porudzbine kupac useeffecr')
      getPorudzbineByKupac(state.token)
        .then((response) => {
          setPorudzbine(response.data)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [])

  return (
    <Grid item xs={12} sx={{ width: '60%' }}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Fragment>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            {role === 'Admin' ? 'Sve porudžbine' : 'Moje porudžbine'}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Broj porudžbine</TableCell>
                <TableCell>Datum kreiranja</TableCell>
                <TableCell>Ukupan iznos</TableCell>
                <TableCell>Plaćena porudžbina?</TableCell>
                <TableCell>Datum plaćanja</TableCell>
                {role === 'Admin' && <TableCell>Korisnik</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {porudzbine.length > 0 ? (
                porudzbine.map((porudzbina) => (
                  <TableRow key={porudzbina.porudzbinaId}>
                    <TableCell>{porudzbina.brojPorudzbine}</TableCell>
                    <TableCell>
                      {format(
                        new Date(porudzbina.datumKreiranja),
                        'dd/MM/yyyy',
                      )}
                    </TableCell>
                    <TableCell>
                      {porudzbina.ukupanIznos.toLocaleString('sr-RS', {
                        style: 'currency',
                        currency: 'RSD',
                      })}
                    </TableCell>
                    <TableCell>
                      {porudzbina.placenaPorudzbina === true ? 'Da' : 'Ne'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(porudzbina.datumPlacanja), 'dd/MM/yyyy')}
                    </TableCell>
                    {role === 'Admin' && (
                      <TableCell>
                        {porudzbina.korisnik.ime +
                          ' ' +
                          porudzbina.korisnik.prezime}
                      </TableCell>
                    )}
                    {role === 'Kupac' && (
                      <TableCell>
                        <DeleteIcon
                          sx={{
                            marginRight: 1,
                            color: theme.palette.primary.main,
                            fontSize: '1.5rem',
                            cursor: 'pointer'
                          }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow variant="subtitle2">
                  <TableCell>Nema porudžbina</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {porudzbine.length > 9 && <Pagination />}
        </Fragment>
      </Paper>
    </Grid>
  )
}

export default Orders
