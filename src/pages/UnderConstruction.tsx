import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import type { User } from '../types';
import './Dashboard.css';

interface UnderConstructionProps {
  title: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ title }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Header user={user} />
      <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>{title}</h2>
        <div style={{ marginTop: '20px', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>🚧</span>
          <h3>Em Construção</h3>
          <p style={{ marginTop: '10px', marginBottom: '20px', color: '#666', lineHeight: '1.6' }}>
            Estamos trabalhando nos últimos detalhes desta funcionalidade para entregar a melhor experiência possível.<br/>
            Ela estará disponível a partir do dia <strong>09/02</strong>.
          </p>
          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
            <p style={{ marginBottom: '15px', fontSize: '0.95rem' }}>
              Enquanto isso, você pode encontrar conteúdos relacionados na nossa biblioteca:
            </p>
            <Link 
              to="/existing-materials" 
              className="action-button"
              style={{ 
                display: 'inline-block', 
                textDecoration: 'none', 
                padding: '10px 20px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                borderRadius: '6px'
              }}
            >
              Acessar Biblioteca de Materiais
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
