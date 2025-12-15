import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activityGeneratorService } from '../services/api';
import type { User, ActivityRecord } from '../types';
import Header from '../components/Header';
import './LessonPlanDetails.css';

const ActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [record, setRecord] = useState<ActivityRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadRecord();
  }, [id]);

  const loadRecord = async () => {
    if (!id) return;
    try {
      const data = await activityGeneratorService.getById(id);
      setRecord(data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      alert('Erro ao carregar detalhes das atividades.');
      navigate('/activities');
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

  if (!record) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Header user={user} />
      
      <div className="details-container">
        <div className="details-header">
          <h2>Atividades Dinâmicas - {record.grade_level}</h2>
          {record.created_at && (
            <div className="details-date">Criado em: {new Date(record.created_at).toLocaleDateString()}</div>
          )}
        </div>

        <div className="details-section">
          <p><strong>Número de Alunos:</strong> {record.number_of_students}</p>
          <p><strong>Ambiente:</strong> {record.environment}</p>
        </div>

        {record.activities && record.activities.length > 0 && (
          <div className="details-section">
            <h3>Atividades</h3>
            {record.activities.map((activity, index) => (
              <div key={index} className="activity-detail">
                <h4>{activity.title}</h4>
                <p><strong>Objetivo:</strong> {activity.objective}</p>
                <p><strong>Descrição:</strong> {activity.description}</p>
                <p><strong>Duração:</strong> {activity.duration}</p>
                
                {activity.materials && activity.materials.length > 0 && (
                  <>
                    <p><strong>Materiais:</strong></p>
                    <ul>
                      {activity.materials.map((mat, i) => (
                        <li key={i}>{mat}</li>
                      ))}
                    </ul>
                  </>
                )}

                {activity.step_by_step && activity.step_by_step.length > 0 && (
                  <>
                    <p><strong>Passo a Passo:</strong></p>
                    <ol>
                      {activity.step_by_step.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </>
                )}

                {activity.adaptation && (
                  <p><strong>Adaptações:</strong> {activity.adaptation}</p>
                )}
                <hr />
              </div>
            ))}
          </div>
        )}

        <div className="details-actions">
          <button onClick={() => navigate('/activities')} className="back-button">Voltar</button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
