import React, { Fragment, useState, useEffect } from 'react'
import { Paper, Grid, Box, Typography, Button } from '@mui/material'
import { getProfil, deleteKorisnik } from '../../services/korisnikService'
import { getUserRole } from '../../utilities/authUtilities'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserDialog from '../Dialogs/UserDialog'
import { LOGOUT } from '../../constants/actionTypes'

const ProfileDetails = () => {
  const [profileDetails, setProfileDetails] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditProfile, setIsEditProfile] = useState(false)
  const role = getUserRole()
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('korisnik useeffecr')
    getProfil(state.token)
      .then((response) => {
        setProfileDetails(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [state.token])

  const handleDelete = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete profil?')) {
      deleteKorisnik(id, state.token)
        .then(() => {
          if (state.token) {
            dispatch({ type: LOGOUT })
          }
          navigate('/prijaviSe')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleIsEditProfile = (korisnik) => {
    setIsEditProfile(true)
    setDialogOpen(true)
  }

  const handleEditProfile = (korisnik) => {
    setProfileDetails(korisnik)
  }

  return (
    <Grid item xs={12} md={4} lg={3} sx={{ width: '30%' }}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 275,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Fragment>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Moj profil
          </Typography>
          {profileDetails && (
            <Fragment>
              <Typography component="p" variant="h6" sx={{ marginBottom: 2 }}>
                {role === 'Kupac'
                  ? profileDetails.ime + ' ' + profileDetails.prezime
                  : 'Admin'}
              </Typography>
              <Typography color="text.secondary">
                <strong>Mejl:</strong> {profileDetails.email}
              </Typography>
              <Typography color="text.secondary">
                <strong>Broj telefona:</strong>{' '}
                {role === 'Kupac' && profileDetails.brojTelefona
                  ? profileDetails.brojTelefona
                  : 'Nema podataka o broju telefona'}
              </Typography>
              <Typography color="text.secondary">
                <strong>Ulica i broj:</strong>{' '}
                {role === 'Kupac' && profileDetails.ulica
                  ? profileDetails.ulica + ' ' + profileDetails.broj
                  : 'Nema podataka o ulici i broju'}
              </Typography>
              <Typography color="text.secondary">
                <strong>Mesto:</strong>{' '}
                {role === 'Kupac' && profileDetails.mesto
                  ? profileDetails.mesto
                  : 'Nema podataka o mestu'}
              </Typography>
            </Fragment>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              fontSize: '2rem',
              marginTop: '40px',
            }}
          >
            <Button variant="outlined" onClick={handleIsEditProfile}>
              Uredi profil
            </Button>
            {dialogOpen && (
              <UserDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                profileToEdit={profileDetails}
                isEditProfile={isEditProfile}
                setIsEditProfile={setIsEditProfile}
                onProfileEdit={handleEditProfile}
              />
            )}
            <Button
              variant="contained"
              onClick={() => handleDelete(profileDetails.korisnikId)}
            >
              Obriši nalog
            </Button>
          </Box>
        </Fragment>
      </Paper>
    </Grid>
  )
}

export default ProfileDetails
