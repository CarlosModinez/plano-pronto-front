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
          <p className="modal-subtitle">Continue criando seus materiais pedagógicos</p>
        </div>

        <div className="modal-body">
          <p>Você utilizou todos os seus créditos disponíveis.</p>
          <div className="offer-box">
            <span className="offer-label">Pacote Promocional</span>
            <div className="offer-content">
              <span className="credits-amount">20 Créditos</span>
              <p className="offer-description">Continue gerando planos de aula, atividades e muito mais!</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Agora Não</button>
          <a 
            href="https://payfast.greenn.com.br/149926" 
            className="buy-credits-button" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Adquirir Créditos
          </a>
        </div>
      </div>
    </div>
  );
};

export default InsufficientCreditsModal;
