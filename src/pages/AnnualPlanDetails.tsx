import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { annualPlanService } from '../services/api';
import { documentService } from '../services/documentService';
import type { User, AnnualPlan } from '../types';
import Header from '../components/Header';
import ContentDetailsLayout from '../components/ContentDetailsLayout';
import './LessonPlanDetails.css';

const AnnualPlanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<AnnualPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    if (!id) return;
    try {
      const data = await annualPlanService.getById(id);
      setPlan(data);
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
      alert('Erro ao carregar detalhes do plano anual.');
      navigate('/annual-plan');
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

  if (!plan) {
    return null;
  }

  const renderBimestre = (label: string, bimestre: any) => {
    if (!bimestre || !bimestre.tema) return null;
    
    return (
      <div className="details-section">
        <h3>{label}</h3>
        <p><strong>Tema:</strong> {bimestre.tema}</p>
        {bimestre.etapas && bimestre.etapas.length > 0 && (
          <>
            <h4>Etapas:</h4>
            <ul>
              {bimestre.etapas.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
        {bimestre.metodologia && bimestre.metodologia.length > 0 && (
          <>
            <h4>Metodologia:</h4>
            <ul>
              {bimestre.metodologia.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
        {bimestre.recursos && bimestre.recursos.length > 0 && (
          <>
            <h4>Recursos:</h4>
            <ul>
              {bimestre.recursos.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
        {bimestre.avaliacoes && bimestre.avaliacoes.length > 0 && (
          <>
            <h4>Avaliações:</h4>
            <ul>
              {bimestre.avaliacoes.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
        {bimestre.referencias && bimestre.referencias.length > 0 && (
          <>
            <h4>Referências:</h4>
            <ul>
              {bimestre.referencias.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Header user={user} />
      
      <ContentDetailsLayout
        title={`${plan.discipline} - ${plan.serie}`}
        subtitle={
          <>
            <span className="tag">{plan.discipline}</span>
            <span className="tag">{plan.serie}</span>
            {plan.created_at && (
              <span className="details-date">Criado em: {new Date(plan.created_at).toLocaleDateString()}</span>
            )}
          </>
        }
        onBack={() => navigate('/annual-plan')}
        onDownloadDocx={() => documentService.generateAnnualPlanDocx(plan)}
        onDownloadPdf={() => documentService.generateAnnualPlanPdf(plan)}
      >
        {plan.area_conhecimento && (
          <div className="details-section">
            <h3>Área de Conhecimento</h3>
            <p>{plan.area_conhecimento}</p>
          </div>
        )}

        {plan.conceito_geral && (
          <div className="details-section">
            <h3>Conceito Geral</h3>
            <p>{plan.conceito_geral}</p>
          </div>
        )}

        {plan.objetivo_geral && (
          <div className="details-section">
            <h3>Objetivo Geral</h3>
            <p>{plan.objetivo_geral}</p>
          </div>
        )}

        {plan.objetivo_especifico && plan.objetivo_especifico.length > 0 && (
          <div className="details-section">
            <h3>Objetivos Específicos</h3>
            <ul>
              {plan.objetivo_especifico.map((obj, index) => (
                <li key={index}>{obj}</li>
              ))}
            </ul>
          </div>
        )}

        {plan.competencias && plan.competencias.length > 0 && (
          <div className="details-section">
            <h3>Competências</h3>
            <ul>
              {plan.competencias.map((comp, index) => (
                <li key={index}>{comp}</li>
              ))}
            </ul>
          </div>
        )}

        {plan.conhecimentos_habilidades && plan.conhecimentos_habilidades.length > 0 && (
          <div className="details-section">
            <h3>Conhecimentos e Habilidades</h3>
            <ul>
              {plan.conhecimentos_habilidades.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {renderBimestre('1º Bimestre', plan.primeiro_bimestre)}
        {renderBimestre('2º Bimestre', plan.segundo_bimestre)}
        {renderBimestre('3º Bimestre', plan.terceiro_bimestre)}
        {renderBimestre('4º Bimestre', plan.quarto_bimestre)}
      </ContentDetailsLayout>
    </div>
  );
};

export default AnnualPlanDetails;
