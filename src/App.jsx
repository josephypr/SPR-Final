import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./feature/auth/Login";
import RegistroContratista from './feature/auth/RegistroContratista';
import RegistroPrestador from './feature/auth/RegistroPrestador';
import EscogerRol from './feature/auth/EscogerRol';
import Index from './index';
import Home from "./feature/home/home";
import Homecontratista from './feature/home/homeContratista'; "./feature/home/homecontratista";
import HomePrestador from "./feature/home/homePrestador";
import PerfilContratista from './feature/auth/perfilcontratista';
import PerfilPrestador from './feature/auth/perfilPrestador';
import Perfil from './feature/auth/perfil';
import ProtectedRoute from './feature/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<EscogerRol />} />
        <Route path="/RegistroContratista" element={<RegistroContratista />} />
        <Route path="/RegistroPrestador" element={<RegistroPrestador />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Prestador" element={<PerfilPrestador/>} />

        {/* Rutas protegidas */}
           <Route path="/homecontratista" element={
          <ProtectedRoute element={< Homecontratista/>} />
        } />

        <Route path="/home" element={
          <ProtectedRoute element={<Home />} />
        } />

        <Route path="/homePrestador" element={
          <ProtectedRoute element={<HomePrestador />} />
        } />

        <Route path="/perfilContratista" element={
          <ProtectedRoute element={<PerfilContratista />} />
        } />

        <Route path="/perfilPrestador" element={
          <ProtectedRoute element={<PerfilPrestador />} />
        } />
      </Routes>
    </Router>
  );
}

export default App;
