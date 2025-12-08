import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { materialService } from '../services/api';
import type { Material } from '../types';
import './LessonPlanDetails.css';

const LessonPlanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadMaterial(id);
    }
  }, [id]);

  const loadMaterial = async (materialId: string) => {
    try {
      const data = await materialService.getById(materialId);
      setMaterial(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar o plano de aula.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="details-container">Carregando...</div>;
  if (error) return <div className="details-container" style={{ color: 'red' }}>{error}</div>;
  if (!material) return <div className="details-container">Plano de aula não encontrado.</div>;

  return (
    <div className="details-container">
      <Link to="/dashboard" className="back-button">← Voltar para o Dashboard</Link>
      
      <header className="details-header">
        <h1 className="details-title">{material.theme}</h1>
        <div className="details-meta">
          <span className="tag">{material.discipline}</span>
          <span className="tag">{material.serie}</span>
          <span className="tag">{material.duration} min</span>
        </div>
        <div className="details-date">Criado em: {new Date(material.created_at).toLocaleDateString()}</div>
      </header>

      <div className="details-grid">
        {material.foundation && (
          <section className="details-section full-width">
            <h3>Fundamentação</h3>
            <p>{material.foundation}</p>
          </section>
        )}

        {material.general_objective && (
          <section className="details-section full-width">
            <h3>Objetivo Geral</h3>
            <p>{material.general_objective}</p>
          </section>
        )}

        {material.specific_objectives && material.specific_objectives.length > 0 && (
          <section className="details-section">
            <h3>Objetivos Específicos</h3>
            <ul>
              {material.specific_objectives.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {material.content && material.content.length > 0 && (
          <section className="details-section">
            <h3>Conteúdo</h3>
            <ul>
              {material.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {material.methodology && material.methodology.length > 0 && (
          <section className="details-section full-width">
            <h3>Metodologia</h3>
            <ol>
              {material.methodology.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </section>
        )}

        {material.resources && material.resources.length > 0 && (
          <section className="details-section">
            <h3>Recursos Didáticos</h3>
            <ul>
              {material.resources.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {material.evaluation && (
          <section className="details-section">
            <h3>Avaliação</h3>
            <p>{material.evaluation}</p>
          </section>
        )}

        {material.skills && material.skills.length > 0 && (
          <section className="details-section full-width">
            <h3>Habilidades (BNCC)</h3>
            <ul>
              {material.skills.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {material.adaptations && material.adaptations.length > 0 && (
          <section className="details-section">
            <h3>Adaptações</h3>
            <ul>
              {material.adaptations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {material.homework && material.homework.length > 0 && (
          <section className="details-section">
            <h3>Atividades de Casa</h3>
            <ul>
              {material.homework.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {material.additional_context && (
          <section className="details-section full-width">
            <h3>Contexto Adicional</h3>
            <p>{material.additional_context}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default LessonPlanDetails;
