import React, { Fragment } from 'react'
import Pagination from '../Pagination'
import PharmacyTable from './PharmacyTable'
import ProductTable from './ProductTable.js'
import UserTable from './UserTable'
import { TableContainer, Paper } from '@mui/material'
import { getUserRole } from '../../utilities/authUtilities'
import { Navigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

const SharedTableContainer = (props) => {
  const { state } = useAuth()
  const role = getUserRole()

  if (role !== 'Admin' || state?.token === null) {
    return <Navigate to="/notFound" />
  }

  return (
    <Fragment>
      <TableContainer
        component={Paper}
        sx={{ marginTop: '120px', marginBottom: '50px' }}
      >
        {props.isPharmacyTable && <PharmacyTable />}
        {props.isProductTable && <ProductTable />}
        {props.isUserTable && <UserTable />}
      </TableContainer>
      <Pagination />
    </Fragment>
  )
}

export default SharedTableContainer
