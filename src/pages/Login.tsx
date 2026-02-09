import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const DEFAULT_PASSWORD = '123456';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login({ email, password: DEFAULT_PASSWORD });
      navigate('/dashboard');
    } catch (err) {
      setError('Falha no login. Verifique seu email.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register({ 
        name: registerName, 
        email: registerEmail, 
        password: DEFAULT_PASSWORD 
      });
      // Auto login after register
      await authService.login({ email: registerEmail, password: DEFAULT_PASSWORD });
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Este email já está cadastrado.');
      } else {
        setError('Falha ao criar conta. Tente novamente.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {!showRegister ? (
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-logo-container">
            <img src="/logo.png" alt="Logo" className="auth-logo" />
          </div>
          <h2 className="auth-title">Login</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <button 
            type="button" 
            className="auth-link" 
            onClick={() => { setShowRegister(true); setError(''); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Criar conta
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-logo-container">
            <img src="/logo.png" alt="Logo" className="auth-logo" />
          </div>
          <h2 className="auth-title">Criar Conta</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="registerName">Nome</label>
            <input
              type="text"
              id="registerName"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="registerEmail">Email</label>
            <input
              type="email"
              id="registerEmail"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
          <button 
            type="button" 
            className="auth-link" 
            onClick={() => { setShowRegister(false); setError(''); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Voltar ao login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
