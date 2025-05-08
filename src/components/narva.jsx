import { useNavigate } from 'react-router-dom';
import '../styles/NarvarInd.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo">SPR</div>
      <div className="nav-links">
        <button onClick={() => navigate('/Login')}>INICIAR SESIÓN</button>
        <button onClick={() => navigate('/EscogerRol')}>REGISTRARSE</button>
      </div>
    </div>
  );
};

export default Navbar;
