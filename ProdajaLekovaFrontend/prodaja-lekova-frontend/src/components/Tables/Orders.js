import React, { Fragment, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getUserRole } from '../../utilities/authUtilities'
import {
  getPorudzbine,
  getPorudzbineByKupac,
  getStavkePorudzbine,
} from '../../services/porudzbinaService'
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
  Accordion,
  AccordionDetails,
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'

const Orders = () => {
  const role = getUserRole()
  const { state } = useAuth()
  const theme = useTheme()
  const [porudzbine, setPorudzbine] = useState([])
  const [stavke, setStavke] = useState([])
  const [expandedOrder, setExpandedOrder] = useState(null)

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

  const toggleExpand = (porudzbinaId) => {
    if (expandedOrder === porudzbinaId) {
      setExpandedOrder(null)
      setStavke([])
    } else {
      setExpandedOrder(porudzbinaId)
      getStavkePorudzbine(porudzbinaId, state.token)
        .then((response) => {
          setStavke(response.data.stavkaPorudzbine)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const isActiveRow = (porudzbinaId) => {
    return expandedOrder === porudzbinaId
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
                  <TableRow
                    key={porudzbina.porudzbinaId}
                    onClick={() => toggleExpand(porudzbina.porudzbinaId)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#F0FFEC',
                      },
                      backgroundColor: isActiveRow(porudzbina.porudzbinaId)
                        ? '#F0FFEC'
                        : 'inherit',
                    }}
                  >
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
                  </TableRow>
                ))
              ) : (
                <TableRow variant="subtitle2">
                  <TableCell>Nema porudžbina</TableCell>
                </TableRow>
              )}
              {/*Accordion*/}
              {expandedOrder !== null && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Accordion
                      expanded={expandedOrder !== null}
                      sx={{ backgroundColor: theme.palette.background.default }}
                    >
                      <AccordionDetails>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Naziv proizvoda</TableCell>
                              <TableCell>Tip proizvoda</TableCell>
                              <TableCell>Kolicina</TableCell>
                              <TableCell>Cena</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {stavke &&
                              stavke.map((stavka) => (
                                <TableRow key={stavka.stavkaId}>
                                  <TableCell>
                                    {
                                      stavka.apotekaProizvod.proizvod
                                        .nazivProizvoda
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {
                                      stavka.apotekaProizvod.proizvod
                                        .tipProizvoda.nazivTipaProizvoda
                                    }
                                  </TableCell>
                                  <TableCell>{stavka.kolicina}</TableCell>
                                  <TableCell>
                                    {stavka.apotekaProizvod.cenaSaPopustom}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
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
