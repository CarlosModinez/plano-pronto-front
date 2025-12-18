import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar email de recuperação. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-logo-container">
          <img src="/logo.png" alt="Logo" className="auth-logo" />
        </div>
        <h2 className="auth-title">Esqueci minha senha</h2>
        <p className="auth-subtitle">Digite seu email para receber o link de recuperação</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>
        
        <div className="auth-links">
          <Link to="/login" className="auth-link">Voltar para o login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
