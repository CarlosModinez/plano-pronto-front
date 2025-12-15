import React, { useState, useEffect } from 'react';
import { studentReportService } from '../services/api';
import type { User, StudentReportRequest, StudentReport } from '../types';
import Header from '../components/Header';
import MaterialCard from '../components/MaterialCard';
import './Dashboard.css';

const StudentReportGenerator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [formData, setFormData] = useState<StudentReportRequest>({
    serie: '',
    nivel_dificuldade: '',
    pontos_fortes: '',
    pontos_atencao: '',
    comportamento_social: '',
    necessidades_especificas: '',
    observacoes_professor: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await studentReportService.list();
      setReports(data.reports || []);
      
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, credits: data.credits };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentReportService.create(formData);
      await loadReports();
      setFormData({
        serie: '',
        nivel_dificuldade: '',
        pontos_fortes: '',
        pontos_atencao: '',
        comportamento_social: '',
        necessidades_especificas: '',
        observacoes_professor: '',
      });
      alert('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      try {
        await studentReportService.delete(id);
        setReports(reports.filter(report => report.id !== id));
      } catch (error) {
        console.error('Erro ao excluir relatório:', error);
        alert('Erro ao excluir relatório.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="dashboard-container">
      <Header user={user} />

      <div className="content-grid">
        <div className="card">
          <h3>Gerador de Relatório do Aluno</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Série/Ano *</label>
              <input
                type="text"
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nível de Dificuldade *</label>
              <select
                name="nivel_dificuldade"
                value={formData.nivel_dificuldade}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="Baixo">Baixo</option>
                <option value="Médio">Médio</option>
                <option value="Alto">Alto</option>
              </select>
            </div>
            <div className="form-group">
              <label>Pontos Fortes</label>
              <textarea
                name="pontos_fortes"
                value={formData.pontos_fortes}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Pontos de Atenção</label>
              <textarea
                name="pontos_atencao"
                value={formData.pontos_atencao}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Comportamento Social</label>
              <textarea
                name="comportamento_social"
                value={formData.comportamento_social}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Necessidades Específicas</label>
              <input
                type="text"
                name="necessidades_especificas"
                value={formData.necessidades_especificas}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Observações do Professor</label>
              <textarea
                name="observacoes_professor"
                value={formData.observacoes_professor}
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Relatórios Gerados</h3>
          {reports.length === 0 ? (
            <p className="no-materials">Nenhum relatório gerado ainda.</p>
          ) : (
            <div className="materials-list">
              {reports.map(report => (
                <MaterialCard
                  key={report.id}
                  title={`Relatório - ${report.serie}`}
                  subtitle={<p><strong>Nível:</strong> {report.nivel_dificuldade}</p>}
                  date={report.created_at}
                  viewLink={`/student-report/${report.id}`}
                  onDelete={() => handleDelete(report.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReportGenerator;
