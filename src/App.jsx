import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./feature/auth/Login";
import RegistroContratista from './feature/auth/RegistroContratista';
import RegistroPrestador from './feature/auth/RegistroPrestador';
import EscogerRol from './feature/auth/EscogerRol';
import Index from './index';
import Home from "./feature/home/home";
import HomePrestador from "./feature/home/homePrestador";
import PerfilContratista from './feature/auth/perfilcontratista';
import Homecontratista from './feature/home/homeContratista'
import PerfilPrestador from './feature/auth/perfilPrestador';
import Perfil from './feature/auth/perfil';
import ProtectedRoute from './feature/auth/ProtectedRoute';
import Portafolioprestador from './feature/servicios/portafolioprestador';
import PerfilPortafolio from './feature/auth/PerfilPortafolio';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<EscogerRol />} />
        <Route path="/Registrocontratista" element={<RegistroContratista />} />
        <Route path="/RegistroPrestador" element={<RegistroPrestador />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Prestador" element={<PerfilPrestador/>} />
        <Route path="/PerfilPortafolio" element={<PerfilPortafolio/>} />
        

        

        {/* Rutas protegidas */}
     

         <Route path="/homecontratista" element={
          <ProtectedRoute element={< Homecontratista/>} />
        } />

        <Route path="/home" element={
          <ProtectedRoute element={< Home/>} />
        } />

        <Route 
          path="/portafolio" 
          element={<ProtectedRoute element={<Portafolioprestador />} 
          />} 
          />

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
