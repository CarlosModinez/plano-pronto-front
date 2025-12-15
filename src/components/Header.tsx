import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { User } from '../types';
import './Header.css';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>
        <img src="/logo.png" alt="Logo" className="header-logo" />
        <div>
          <h1>Gerador de Planos</h1>
          {user && <p className="user-info">Bem-vindo, <strong>{user.name}</strong> | Créditos: <strong>{user.credits}</strong></p>}
        </div>
      </div>

      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Aulas Diárias</Link>
        <Link to="/annual-plan" className="nav-link" onClick={() => setIsMenuOpen(false)}>Plano Anual</Link>
        <Link to="/didactic-sequence" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sequência Didática</Link>
        {/* <Link to="/activities" className="nav-link" onClick={() => setIsMenuOpen(false)}>Atividades</Link> */}
        {/* <Link to="/student-report" className="nav-link" onClick={() => setIsMenuOpen(false)}>Relatório Aluno</Link> */}
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </nav>
    </header>
  );
};

export default Header;
