import React from 'react'
import Orders from '../Tables/Orders'
import ProfileDetails from './ProfileDetails'
import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProfilePage = () => {
  const { state } = useAuth()

  if (state?.token === null) {
    return <Navigate to="/notFound" />
  }

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
