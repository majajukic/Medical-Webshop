import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Ups! Nešto je pošlo po zlu
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Došlo je do neočekivane greške. Molimo pokušajte ponovo.
            </Typography>
            <Button variant="contained" onClick={this.handleReload}>
              Osveži stranicu
            </Button>
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
