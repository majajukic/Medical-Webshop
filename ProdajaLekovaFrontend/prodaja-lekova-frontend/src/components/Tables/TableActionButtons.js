import { Button, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const TableActionButtons = ({ onEdit, onDelete, theme }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
      }}
    >
      <Button
        variant="outlined"
        size="small"
        startIcon={<EditIcon />}
        onClick={onEdit}
        sx={{
          color: theme.palette.secondary.main,
          borderColor: theme.palette.secondary.main,
          '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            borderColor: theme.palette.secondary.main,
          },
        }}
      >
        Izmeni
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={onDelete}
        sx={{
          color: theme.palette.error.main,
          borderColor: theme.palette.error.main,
          '&:hover': {
            backgroundColor: theme.palette.error.light,
            borderColor: theme.palette.error.main,
          },
        }}
      >
        Obriši
      </Button>
    </Box>
  )
}

export default TableActionButtons
