import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentReportService } from '../services/api';
import type { User, StudentReport } from '../types';
import Header from '../components/Header';
import './LessonPlanDetails.css';

const StudentReportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadReport();
  }, [id]);

  const loadReport = async () => {
    if (!id) return;
    try {
      const data = await studentReportService.getById(id);
      setReport(data);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      alert('Erro ao carregar detalhes do relatório.');
      navigate('/student-report');
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

  if (!report) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Header user={user} />
      
      <div className="details-container">
        <div className="details-header">
          <h2>Relatório do Aluno - {report.serie}</h2>
          {report.created_at && (
            <div className="details-date">Criado em: {new Date(report.created_at).toLocaleDateString()}</div>
          )}
        </div>

        <div className="details-section">
          <p><strong>Nível de Dificuldade:</strong> {report.nivel_dificuldade}</p>
          {report.necessidades_especificas && (
            <p><strong>Necessidades Específicas:</strong> {report.necessidades_especificas}</p>
          )}
        </div>

        {report.pontos_fortes && (
          <div className="details-section">
            <h3>Pontos Fortes</h3>
            <p>{report.pontos_fortes}</p>
          </div>
        )}

        {report.pontos_atencao && (
          <div className="details-section">
            <h3>Pontos de Atenção</h3>
            <p>{report.pontos_atencao}</p>
          </div>
        )}

        {report.comportamento_social && (
          <div className="details-section">
            <h3>Comportamento Social</h3>
            <p>{report.comportamento_social}</p>
          </div>
        )}

        {report.observacoes_professor && (
          <div className="details-section">
            <h3>Observações do Professor</h3>
            <p>{report.observacoes_professor}</p>
          </div>
        )}

        {report.introducao && (
          <div className="details-section">
            <h3>Introdução</h3>
            <p>{report.introducao}</p>
          </div>
        )}

        {report.desempenho_academico && (
          <div className="details-section">
            <h3>Desempenho Acadêmico</h3>
            <p>{report.desempenho_academico}</p>
          </div>
        )}

        {report.habilidades_sociais && (
          <div className="details-section">
            <h3>Habilidades Sociais</h3>
            <p>{report.habilidades_sociais}</p>
          </div>
        )}

        {report.comportamento && (
          <div className="details-section">
            <h3>Comportamento</h3>
            <p>{report.comportamento}</p>
          </div>
        )}

        {report.consideracoes_finais && (
          <div className="details-section">
            <h3>Considerações Finais</h3>
            <p>{report.consideracoes_finais}</p>
          </div>
        )}

        <div className="details-actions">
          <button onClick={() => navigate('/student-report')} className="back-button">Voltar</button>
        </div>
      </div>
    </div>
  );
};

export default StudentReportDetails;
