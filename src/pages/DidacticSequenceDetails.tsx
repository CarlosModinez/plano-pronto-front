import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { didacticSequenceService } from '../services/api';
import { documentService } from '../services/documentService';
import type { User, DidacticSequence } from '../types';
import Header from '../components/Header';
import './LessonPlanDetails.css';

const DidacticSequenceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [sequence, setSequence] = useState<DidacticSequence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadSequence();
  }, [id]);

  const loadSequence = async () => {
    if (!id) return;
    try {
      const data = await didacticSequenceService.getById(id);
      setSequence(data);
    } catch (error) {
      console.error('Erro ao carregar sequência:', error);
      alert('Erro ao carregar detalhes da sequência didática.');
      navigate('/didactic-sequence');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Header user={user} />
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (!sequence) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Header user={user} />
      
      <div className="details-container">
        <div className="details-header">
          <h2>{sequence.titulo || sequence.tema}</h2>
          {sequence.created_at && (
            <div className="details-date">Criado em: {new Date(sequence.created_at).toLocaleDateString()}</div>
          )}
        </div>

        <div className="details-section">
          <p><strong>Disciplina:</strong> {sequence.disciplina}</p>
          <p><strong>Série:</strong> {sequence.serie}</p>
        </div>

        {sequence.objetivo_principal && (
          <div className="details-section">
            <h3>Objetivo Principal</h3>
            <p>{sequence.objetivo_principal}</p>
          </div>
        )}

        {sequence.habilidades_bncc && sequence.habilidades_bncc.length > 0 && (
          <div className="details-section">
            <h3>Habilidades da BNCC</h3>
            <ul>
              {sequence.habilidades_bncc.map((hab, index) => (
                <li key={index}>{hab}</li>
              ))}
            </ul>
          </div>
        )}

        {sequence.dias && sequence.dias.length > 0 && (
          <div className="details-section">
            <h3>Sequência de Aulas</h3>
            {sequence.dias.map((dia, diaIndex) => (
              <div key={diaIndex} className="dia-item">
                <h4>Dia {dia.numero}: {dia.titulo}</h4>
                {dia.atividades && dia.atividades.map((atividade, atIndex) => (
                  <div key={atIndex} className="atividade-item">
                    <h5>Atividade {atividade.numero}: {atividade.nome}</h5>
                    <p><strong>Metodologia:</strong> {atividade.metodologia}</p>
                    <p><strong>Recursos Necessários:</strong> {atividade.recursos}</p>
                    <p><strong>Descrição:</strong> {atividade.descricao}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {sequence.avaliacao && (
          <div className="details-section">
            <h3>Avaliação</h3>
            <p>{sequence.avaliacao}</p>
          </div>
        )}

        {sequence.consideracoes_finais && (
          <div className="details-section">
            <h3>Considerações Finais</h3>
            <p>{sequence.consideracoes_finais}</p>
          </div>
        )}

        <div className="details-actions">
          <button onClick={() => navigate('/didactic-sequence')} className="back-button">Voltar</button>
          <button onClick={() => documentService.generateDidacticSequenceDocx(sequence)} className="download-button">
            Baixar DOCX
          </button>
          <button onClick={() => documentService.generateDidacticSequencePdf(sequence)} className="download-button">
            Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DidacticSequenceDetails;
