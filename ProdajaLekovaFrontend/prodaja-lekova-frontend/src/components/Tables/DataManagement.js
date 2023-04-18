import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useTheme,
  Box,
  Link,
  Typography,
} from '@mui/material'

const columns = [
  { id: 'id', label: 'ID', minWidth: 90 },
  { id: 'firstName', label: 'First Name', minWidth: 150 },
  { id: 'lastName', label: 'Last Name', minWidth: 150 },
  { id: 'age', label: 'Age', minWidth: 90 },
  { id: 'email', label: 'Email', minWidth: 250 },
]

const rows = [
  {
    id: 1,
    lastName: 'Snow',
    firstName: 'Jon',
    age: 35,
    email: 'jon.snow@gmail.com',
  },
  {
    id: 2,
    lastName: 'Lannister',
    firstName: 'Cersei',
    age: 42,
    email: 'cersei.lannister@gmail.com',
  },
  {
    id: 3,
    lastName: 'Lannister',
    firstName: 'Jaime',
    age: 45,
    email: 'jaime.lannister@gmail.com',
  },
  {
    id: 4,
    lastName: 'Stark',
    firstName: 'Arya',
    age: 16,
    email: 'arya.stark@gmail.com',
  },
  {
    id: 5,
    lastName: 'Targaryen',
    firstName: 'Daenerys',
    age: 22,
    email: 'daenerys.targaryen@gmail.com',
  },
]

const DataManagement = (props) => {
  const theme = useTheme()

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{ marginTop: '120px', marginBottom: '50px' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{row.firstName}</TableCell>
                <TableCell align="left">{row.lastName}</TableCell>
                <TableCell align="left">{row.age}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell>
                  <Button size="small">
                    <EditIcon
                      sx={{
                        marginRight: 1,
                        color: theme.palette.primary.main,
                        fontSize: '2rem',
                      }}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button size="small">
                    <DeleteIcon
                      sx={{
                        marginRight: 1,
                        color: theme.palette.primary.main,
                        fontSize: '2rem',
                      }}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link color="primary" href="#" underline="none" sx={{ mt: 3 }}>
        <Typography variant="subtitle1">Prikaži više</Typography>
      </Link>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '50px',
        }}
      >
        {props.isPharmacyTable && (
          <Button variant="contained">Dodaj novu apoteku</Button>
        )}
        {props.isUserTable && (
          <Button variant="contained">Dodaj novog korisnika</Button>
        )}
      </Box>
      {props.isProductTable && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginBottom: '50px'
          }}
        >
          <Button variant="contained">Dodaj novi proizvod</Button>
          <Button variant="contained">Dodaj novi tip proizvoda</Button>
          <Button variant="contained">Dodaj proizvod u apoteku</Button>
        </Box>
      )}
    </div>
  )
}

export default DataManagement
