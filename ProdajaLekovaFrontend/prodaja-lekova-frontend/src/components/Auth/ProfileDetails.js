import React, { Fragment} from 'react';
import { Paper, Grid, Box, Typography, Button } from '@mui/material'

const ProfileDetails = () => {
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
            <Typography component="p" variant="h6" sx={{ marginBottom: 2 }}>
              Maja Jukić
            </Typography>
            <Typography color="text.secondary">mjukic2000@gmail.com</Typography>
            <Typography color="text.secondary">0669261026</Typography>
            <Typography color="text.secondary">Matije Hudji 66</Typography>
            <Typography color="text.secondary">Sremska Mitrovica</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                fontSize: '2rem',
                marginTop: '40px',
              }}
            >
              <Button variant="outlined">Uredi nalog</Button>
              <Button variant="contained">Obriši nalog</Button>
            </Box>
          </Fragment>
        </Paper>
      </Grid>
  )
}

export default ProfileDetails