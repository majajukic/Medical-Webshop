import React, { Fragment, memo } from 'react'
import { Button, useTheme } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const ProductAdminActions = ({ onEdit, onDelete }) => {
  const theme = useTheme()

  return (
    <Fragment>
      <Button size="small" onClick={onEdit}>
        <EditIcon
          sx={{ marginRight: 1, color: theme.palette.primary.main }}
        />
      </Button>
      <Button size="small" onClick={onDelete}>
        <DeleteIcon
          sx={{ marginRight: 1, color: theme.palette.primary.main }}
        />
      </Button>
    </Fragment>
  )
}

export default memo(ProductAdminActions)
