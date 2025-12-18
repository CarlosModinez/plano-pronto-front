import React from 'react';
import './ContentDetailsLayout.css';

interface ContentDetailsLayoutProps {
  title: string;
  subtitle?: React.ReactNode;
  onBack: () => void;
  onDownloadDocx: () => void;
  onDownloadPdf: () => void;
  children: React.ReactNode;
}

const ContentDetailsLayout: React.FC<ContentDetailsLayoutProps> = ({
  title,
  subtitle,
  onBack,
  onDownloadDocx,
  onDownloadPdf,
  children,
}) => {
  return (
    <div className="content-details-layout">
      <div className="content-details-top-bar">
        <button onClick={onBack} className="back-button" aria-label="Voltar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Voltar</span>
        </button>
        <div className="download-actions">
          <button onClick={onDownloadDocx} className="download-button docx">
            Baixar DOCX
          </button>
          <button onClick={onDownloadPdf} className="download-button pdf">
            Baixar PDF
          </button>
        </div>
      </div>

      <header className="content-details-header">
        <h1 className="content-details-title">{title}</h1>
        {subtitle && <div className="content-details-subtitle">{subtitle}</div>}
      </header>

      <div className="content-details-body">
        {children}
      </div>
    </div>
  );
};

export default ContentDetailsLayout;
