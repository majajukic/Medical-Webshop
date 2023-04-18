import React from 'react'
import Orders from '../Tables/Orders'
import ProfileDetails from './ProfileDetails'
import { Box } from '@mui/material'

const ProfilePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        marginTop: '200px',
        marginBottom: '100px',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <ProfileDetails />
      <Orders />
    </Box>
  )
}

export default ProfilePage
