import React, { memo } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  useTheme,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { SPACING } from '../../constants/themeConstants'

const GenericTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  emptyMessage,
  addButtonText,
  renderActions,
  getRowKey,
  renderCell,
  minWidth = 650,
}) => {
  const theme = useTheme()

  const defaultRenderCell = (item, column) => {
    if (renderCell) {
      return renderCell(item, column)
    }
    return item[column.id]
  }

  const defaultRenderActions = (item) => {
    if (renderActions) {
      return renderActions(item)
    }

    return (
      <>
        {onEdit && (
          <TableCell>
            <Button size="small" onClick={() => onEdit(item)}>
              <EditIcon
                sx={{
                  marginRight: 1,
                  color: theme.palette.primary.main,
                  fontSize: '2rem',
                }}
              />
            </Button>
          </TableCell>
        )}
        {onDelete && (
          <TableCell>
            <Button size="small" onClick={() => onDelete(item)}>
              <DeleteIcon
                sx={{
                  marginRight: 1,
                  color: theme.palette.primary.main,
                  fontSize: '2rem',
                }}
              />
            </Button>
          </TableCell>
        )}
      </>
    )
  }

  return (
    <Table sx={{ minWidth }} aria-label="generic table">
      {data.length > 0 && (
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align="left"
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {data.length > 0 ? (
          data.map((item) => (
            <TableRow key={getRowKey(item)}>
              {columns.map((column) => (
                <TableCell key={column.id} align="left">
                  {defaultRenderCell(item, column)}
                </TableCell>
              ))}
              {defaultRenderActions(item)}
            </TableRow>
          ))
        ) : (
          <TableRow variant="subtitle2">
            <TableCell>{emptyMessage}</TableCell>
          </TableRow>
        )}
        {onAdd && (
          <TableRow>
            <TableCell colSpan={columns.length + 2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'left',
                  marginBottom: SPACING.XLARGE,
                  marginTop: SPACING.XLARGE,
                  marginLeft: SPACING.SMALL,
                }}
              >
                <Button variant="contained" onClick={onAdd}>
                  {addButtonText}
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default memo(GenericTable)
