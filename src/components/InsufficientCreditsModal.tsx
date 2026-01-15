import React from 'react';
import './InsufficientCreditsModal.css';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="modal-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#f39c12" strokeWidth="2"/>
            <path d="M12 8V12" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="#f39c12"/>
          </svg>
        </div>

        <div className="modal-header-content">
          <h2>Créditos Insuficientes</h2>
          <p className="modal-subtitle">Escolha o melhor plano para você</p>
        </div>

        <div className="modal-body">
          <p>Você utilizou todos os seus créditos disponíveis.</p>
          
          <div className="plans-container">
            {/* Plano Mensal */}
            <div className="plan-card">
              <div className="plan-header">
                <span className="plan-name">Mensal</span>
              </div>
              <div className="plan-price-box">
                <span className="currency">R$</span>
                <span className="amount">18,87</span>
                <span className="period">/mês</span>
              </div>
              <ul className="plan-features">
                <li>Acesso completo</li>
                <li>Geração ilimitada</li>
                <li>Suporte prioriotário</li>
              </ul>
              <a 
                href="https://payfast.greenn.com.br/153213/offer/9FG3IJ" 
                className="plan-button outline" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Assinar Mensal
              </a>
            </div>

            {/* Plano Anual */}
            <div className="plan-card featured">
              <div className="best-value-badge">MELHOR VALOR</div>
              <div className="plan-header">
                <span className="plan-name">Anual</span>
              </div>
              <div className="plan-price-box">
                <span className="currency">R$</span>
                <span className="amount">127,90</span>
                <span className="period">/ano</span>
              </div>
              <p className="savings">Economize R$ 98,54</p>
              <ul className="plan-features">
                <li>Todo o plano mensal</li>
                <li>2 meses grátis</li>
                <li>Acesso à novidades</li>
              </ul>
              <a 
                href="https://payfast.greenn.com.br/153213/offer/RyRUxz" 
                className="plan-button" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Assinar Anual
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientCreditsModal;
