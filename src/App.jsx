import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importaciones de tus componentes
import Login from "./feature/auth/Login";
import RegistroContratista from './feature/auth/RegistroContratista';
import RegistroPrestador from './feature/auth/RegistroPrestador';
import EscogerRol from './feature/auth/EscogerRol';
import Index from './index';
import HomePrestador from "./feature/home/homePrestador";
import HomeContratista from './feature/home/homeContratista'; // Corregido a mayúscula para consistencia
import HomePrestadorPerfiles from "./feature/home/homePrestadorperfiles";
import PerfilContratista from './feature/auth/perfilcontratista';
import PerfilPrestador from './feature/auth/perfilPrestador';
import Perfil from './feature/auth/perfil';
import ProtectedRoute from './feature/auth/ProtectedRoute';
import Portafolioprestador from './feature/servicios/portafolioprestador';
import PerfilPortafolio from './feature/auth/PerfilPortafolio';


function App() {
  return (
    <Router>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<EscogerRol />} />
        <Route path="/registroContratista" element={<RegistroContratista />} />
        <Route path="/registroPrestador" element={<RegistroPrestador />} />

        {/* --- Rutas protegidas para contratistas y prestadores --- */}
        <Route 
          path="/homeContratista" 
          element={<ProtectedRoute element={<HomeContratista />} />} 
        />
        <Route 
          path="/homePrestador" 
          element={<ProtectedRoute element={<HomePrestador />} />} 
        />

        {/* --- Perfiles --- */}
        <Route 
          path="/perfil" 
          element={<ProtectedRoute element={<Perfil />} />} 
        />
        <Route 
          path="/perfilContratista" 
          element={<ProtectedRoute element={<PerfilContratista />} />} 
        />
        <Route 
          path="/perfilPrestador" 
          element={<ProtectedRoute element={<PerfilPrestador />} />} 
        />

        {/* --- Portafolios --- */}
        <Route 
          path="/portafolio" 
          element={<ProtectedRoute element={<Portafolioprestador />} />} 
        />
        <Route 
          path="/perfilPortafolio/:cedula"  // Ver portafolio de otro prestador
          element={<ProtectedRoute element={<PerfilPortafolio />} />} 
        />
        <Route 
          path="/perfilPortafolio"  // Ver portafolio propio
          element={<ProtectedRoute element={<PerfilPortafolio />} />} 
        />

        {/* --- Perfiles de prestadores para contratistas --- */}
        <Route 
          path="/homePrestadorPerfiles" 
          element={<ProtectedRoute element={<HomePrestadorPerfiles />} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;