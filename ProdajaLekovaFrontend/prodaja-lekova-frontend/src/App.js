import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProfilePage from './components/Auth/ProfilePage';
import NotFoundPage from './components/NotFoundPage';
import ProductsPage from './components/Products/ProductsPage';
import DataManagement from './components/Tables/DataManagement';
import Layout from './layout/Layout';
//import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" exact element={<Layout><ProductsPage /></Layout>} />
            <Route path="/upravljajApotekama" element={<Layout><DataManagement isPharmacyTable={true} /></Layout>} />
            <Route path="/upravljajProizvodima" element={<Layout><DataManagement isProductTable={true} /></Layout>} />
            <Route path="/upravljajNalozima" element={<Layout><DataManagement isUserTable={true}/></Layout>} />
            <Route path="/profil" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/prijaviSe" element={<Login />} />
            <Route path="/registrujSe" element={<Register />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
