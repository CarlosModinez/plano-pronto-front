import React, { useState, useEffect } from 'react';
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
          <p>Esta funcionalidade estará disponível em breve!</p>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
