import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProfilePage from './components/Auth/ProfilePage';
import NotFoundPage from './components/NotFoundPage';
import ProductsPage from './components/Products/ProductsPage';
import SharedTableContainer from './components/Tables/SharedTableContainer';
import Layout from './layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { ProizvodProvider } from './context/ProizvodContext';
import { ApotekaProvider } from './context/ApotekaContext';

const App = () => {

  return (
    <AuthProvider>
      <ProizvodProvider>
        <ApotekaProvider>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Routes>
                <Route path="/" exact element={<Layout><ProductsPage /></Layout>} />
                <Route path="/upravljajApotekama" element={<Layout><SharedTableContainer isPharmacyTable={true} /></Layout>} />
                <Route path="/upravljajProizvodima" element={<Layout><SharedTableContainer isProductTable={true} /></Layout>} />
                <Route path="/upravljajNalozima" element={<Layout><SharedTableContainer isUserTable={true}/></Layout>} />
                <Route path="/profil" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/prijaviSe" element={<Login />} />
                <Route path="/registrujSe" element={ <Register />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </ApotekaProvider>
      </ProizvodProvider>
    </AuthProvider>
  )
}

export default App
