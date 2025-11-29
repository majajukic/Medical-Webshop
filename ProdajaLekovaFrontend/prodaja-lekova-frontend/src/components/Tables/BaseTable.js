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
import AddIcon from '@mui/icons-material/Add'
import TableActionButtons from './TableActionButtons'

const BaseTable = ({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  renderRow,
  addButtonLabel = 'Dodaj novo',
  emptyMessage = 'Nema podataka',
}) => {
  const theme = useTheme()

  return (
    <>
      {onAdd && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {addButtonLabel}
          </Button>
        </Box>
      )}

      <Table sx={{ minWidth: 650 }} aria-label="data table">
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
              {(onEdit || onDelete) && (
                <TableCell align="left" style={{ minWidth: 200 }}>
                  Akcije
                </TableCell>
              )}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id || row[columns[0].id]} hover>
                {renderRow ? (
                  renderRow(row)
                ) : (
                  <>
                    {columns.map((column) => (
                      <TableCell key={column.id} align="left">
                        {column.render
                          ? column.render(row[column.id], row)
                          : row[column.id]}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell align="left">
                        <TableActionButtons
                          onEdit={() => onEdit(row)}
                          onDelete={() => onDelete(row)}
                          theme={theme}
                        />
                      </TableCell>
                    )}
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                align="center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default BaseTable
