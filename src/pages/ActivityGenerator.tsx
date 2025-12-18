import React, { useState, useEffect } from 'react';
import { activityGeneratorService } from '../services/api';
import type { User, ActivityGeneratorRequest, ActivityRecord } from '../types';
import Header from '../components/Header';
import MaterialCard from '../components/MaterialCard';
import InsufficientCreditsModal from '../components/InsufficientCreditsModal';
import './Dashboard.css';

const ActivityGenerator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>([]);
  const [formData, setFormData] = useState<ActivityGeneratorRequest>({
    grade_level: '',
    number_of_students: 20,
    environment: 'Sala de aula',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await activityGeneratorService.list();
      setActivityRecords(data.activities || []);
      
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, credits: data.credits };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await activityGeneratorService.create(formData);
      await loadActivities();
      setFormData({
        grade_level: '',
        number_of_students: 20,
        environment: 'Sala de aula',
      });
      alert('Atividades geradas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar atividades:', error);
      if (error.response?.data?.error.toLowerCase().includes("insufficient credits")) {
        setShowCreditModal(true);
      } else {
        alert('Erro ao gerar atividades.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir estas atividades?')) {
      try {
        await activityGeneratorService.delete(id);
        setActivityRecords(activityRecords.filter(record => record.id !== id));
      } catch (error) {
        console.error('Erro ao excluir atividades:', error);
        alert('Erro ao excluir atividades.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_students' ? Number(value) : value
    }));
  };

  return (
    <div className="dashboard-container">
      <Header user={user} />

      <div className="content-grid">
        <div className="card">
          <h3>Gerador de Atividades</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Série/Ano *</label>
              <input
                type="text"
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}

              />
            </div>
            <div className="form-group">
              <label>Número de Alunos *</label>
              <input
                type="number"
                name="number_of_students"
                value={formData.number_of_students}
                onChange={handleChange}
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>
            <div className="form-group">
              <label>Ambiente *</label>
              <select
                name="environment"
                value={formData.environment}
                onChange={handleChange}
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              >
                <option value="Sala de aula">Sala de aula</option>
                <option value="Pátio">Pátio</option>
                <option value="Quadra">Quadra</option>
                <option value="Laboratório">Laboratório</option>
                <option value="Biblioteca">Biblioteca</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Gerando...' : 'Gerar Atividades'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Atividades Geradas</h3>
          {activityRecords.length === 0 ? (
            <p className="no-materials">Nenhuma atividade gerada ainda.</p>
          ) : (
            <div className="materials-list">
              {activityRecords.map(record => (
                <MaterialCard
                  key={record.id}
                  title={`Atividades - ${record.grade_level}`}
                  subtitle={
                    <>
                      <p><strong>Ambiente:</strong> {record.environment}</p>
                      <p><strong>Alunos:</strong> {record.number_of_students}</p>
                    </>
                  }
                  date={record.created_at}
                  viewLink={`/activities/${record.id}`}
                  onDelete={() => handleDelete(record.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <InsufficientCreditsModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
      />
    </div>
  );
};

export default ActivityGenerator;
