import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Login from './components/Login';
import Products from './components/Products';
import Register from './components/Register';
import NotFoundPage from './components/NotFoundPage';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" exact element={< Products />} />
            <Route path="/prijaviSe" element={< Login />} />
            <Route path="/registrujSe" element={< Register />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
