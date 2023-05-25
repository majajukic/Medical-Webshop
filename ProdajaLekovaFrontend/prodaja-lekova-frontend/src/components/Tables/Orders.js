import React, { Fragment, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getUserRole } from '../../utilities/authUtilities'
import {
  getPorudzbine,
  getPorudzbineByKupac,
  deletePorudzbina,
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
  Button,
  useTheme,
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useKorpa } from '../../context/KorpaContext'
import { EMPTY_CART } from '../../constants/actionTypes'
import { toast } from 'react-toastify'

const Orders = () => {
  const role = getUserRole()
  const { state } = useAuth()
  const theme = useTheme()
  const [porudzbine, setPorudzbine] = useState([])
  const { dispatch: korpaDispatch } = useKorpa()

  useEffect(() => {
    if (role === 'Admin') {
      getPorudzbine(state.token)
        .then((response) => {
          setPorudzbine(response.data)
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (role === 'Kupac') {
      getPorudzbineByKupac(state.token)
        .then((response) => {
          setPorudzbine(response.data)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [state.token, role])

  const handleDelete = (id) => {
    if (
      window.confirm('Da li ste sigurni da želite da obrišete ovu porudžbinu?')
    ) {
      deletePorudzbina(id, state.token)
        .then(() => {
          setPorudzbine(
            porudzbine.filter((porudzbina) => porudzbina.porudzbinaId !== id),
          )
          korpaDispatch({ type: EMPTY_CART })

          toast.success('Porudzbina uspesno obrisana!')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

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
            {porudzbine.length > 0 && (
              <TableHead>
                <TableRow>
                  <TableCell>Broj porudžbine</TableCell>
                  <TableCell>Datum kreiranja</TableCell>
                  <TableCell>Ukupan iznos</TableCell>
                  <TableCell>Datum plaćanja</TableCell>
                  {role === 'Admin' && <TableCell>Korisnik</TableCell>}
                </TableRow>
              </TableHead>
            )}
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
                    {porudzbina.placenaPorudzbina === true ? (
                      <TableCell>
                        {format(
                          new Date(porudzbina.datumPlacanja),
                          'dd/MM/yyyy',
                        )}
                      </TableCell>
                    ) : (
                      <TableCell>/</TableCell>
                    )}
                    {role === 'Admin' && (
                      <TableCell>
                        {porudzbina.korisnik.ime +
                          ' ' +
                          porudzbina.korisnik.prezime}
                      </TableCell>
                    )}
                    {role === 'Kupac' &&
                      porudzbina.placenaPorudzbina === false && (
                        <TableCell>
                          <Button
                            onClick={() =>
                              handleDelete(porudzbina.porudzbinaId)
                            }
                          >
                            <DeleteIcon
                              sx={{
                                marginRight: 1,
                                color: theme.palette.primary.main,
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                              }}
                            />
                          </Button>
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
        </Fragment>
      </Paper>
    </Grid>
  )
}

export default Orders
