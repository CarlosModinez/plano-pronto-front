import React from 'react';
import { Link } from 'react-router-dom';

interface MaterialCardProps {
  title: string;
  subtitle?: React.ReactNode;
  date?: string;
  viewLink: string;
  onDelete: () => void;
  onDownloadDocx?: () => void;
  onDownloadPdf?: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  title,
  subtitle,
  date,
  viewLink,
  onDelete,
  onDownloadDocx,
  onDownloadPdf
}) => {
  return (
    <div className="material-item">
      <div className="material-header">
        <span className="material-title">{title}</span>
        {date && <span className="material-date">{new Date(date).toLocaleDateString()}</span>}
      </div>
      <div className="material-details">
        {subtitle}
      </div>
      <div className="material-actions">
        <Link to={viewLink} className="action-button view-button">Ver Detalhes</Link>
        {onDownloadPdf && (
          <button onClick={onDownloadPdf} className="action-button download-button">
            Baixar PDF
          </button>
        )}
        {onDownloadDocx && (
          <button onClick={onDownloadDocx} className="action-button download-button">
            Baixar DOCX
          </button>
        )}
        <button onClick={onDelete} className="action-button delete-button">
          Excluir
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
