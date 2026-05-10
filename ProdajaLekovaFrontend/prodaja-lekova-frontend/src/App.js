import React, { Fragment } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import theme from './theme'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ProfilePage from './components/Auth/ProfilePage'
import NotFoundPage from './components/NotFoundPage'
import ProductsPage from './components/Products/ProductsPage'
import SharedTableContainer from './components/Tables/SharedTableContainer'
import Cart from './components/Cart/Cart'
import Layout from './layout/Layout'
import { AuthProvider } from './context/AuthContext'
import { ProizvodProvider } from './context/ProizvodContext'
import { ApotekaProvider } from './context/ApotekaContext'
import { KorpaProvider } from './context/KorpaContext'
import { PaginationProvider } from './context/PaginationContext'
import PaymentCanceled from './components/Cart/PaymentCanceled'
import PaymentSuccess from './components/Cart/PaymentSuccess'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {

  return (
    <Fragment>
      <ToastContainer />
      <ErrorBoundary>
        <AuthProvider>
          <ProizvodProvider>
            <ApotekaProvider>
              <KorpaProvider>
                  <PaginationProvider>
                    <BrowserRouter>
                      <ThemeProvider theme={theme}>
                        <Routes>
                          <Route path="/" exact element={<Layout><ProductsPage /></Layout>} />
                          <Route path="/proizvodi/:terminPretrage" exact element={<Layout><ProductsPage /></Layout>} />
                          <Route path="/proizvodi/cenaRastuce" exact element={<Layout><ProductsPage /></Layout>} />
                          <Route path="/proizvodi/cenaOpadajuce" exact element={<Layout><ProductsPage /></Layout>} />
                          <Route path="/proizvodi/naPopustu" exact element={<Layout><ProductsPage /></Layout>} />
                          <Route path="/apoteka/:apotekaId" exact element={<Layout><ProductsPage /></Layout>} />
                          <Route path="/kategorija/:kategorijaId" exact element={<Layout><ProductsPage /></Layout>}  />
                          <Route path="/upravljajApotekama" element={<Layout><SharedTableContainer isPharmacyTable={true} /></Layout>} />
                          <Route path="/upravljajProizvodima" element={<Layout><SharedTableContainer isProductTable={true} /></Layout>} />
                          <Route path="/upravljajNalozima" element={<Layout><SharedTableContainer isUserTable={true}/></Layout>} />
                          <Route path="/profil" element={<Layout><ProfilePage /></Layout>} />
                          <Route path="/korpa" element={ <Layout><Cart /></Layout>} />
                          <Route path="/prijaviSe" element={<Login />} />
                          <Route path="/registrujSe" element={ <Register />} />
                          <Route path="/placanjeUspesno" element={ <PaymentSuccess />} />
                          <Route path="/placanjeOtkazano" element={ <PaymentCanceled />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </ThemeProvider>
                    </BrowserRouter>
                  </PaginationProvider>
                </KorpaProvider>
              </ApotekaProvider>
          </ProizvodProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Fragment>
  )
}

export default App
