import React, { useState, useEffect } from 'react';
import { annualPlanService } from '../services/api';
import { documentService } from '../services/documentService';
import type { User, AnnualPlanRequest, AnnualPlan } from '../types';
import Header from '../components/Header';
import MaterialCard from '../components/MaterialCard';
import './Dashboard.css';

const AnnualPlanGenerator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<AnnualPlan[]>([]);
  const [formData, setFormData] = useState<AnnualPlanRequest>({
    discipline: '',
    serie: '',
    quarter_themes: ['', '', '', ''],
    additional_context: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await annualPlanService.list();
      setPlans(data.plans || []);
      
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, credits: data.credits };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error('Erro ao carregar planos anuais:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filter out empty themes
      const themes = formData.quarter_themes?.filter(t => t.trim() !== '') || [];
      const dataToSend = {
        ...formData,
        quarter_themes: themes.length > 0 ? themes : undefined
      };

      await annualPlanService.create(dataToSend);
      await loadPlans();
      setFormData({
        discipline: '',
        serie: '',
        quarter_themes: ['', '', '', ''],
        additional_context: '',
      });
      alert('Plano Anual gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar plano anual:', error);
      alert('Erro ao gerar plano anual.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano anual?')) {
      try {
        await annualPlanService.delete(id);
        setPlans(plans.filter(plan => plan.id !== id));
      } catch (error) {
        console.error('Erro ao excluir plano:', error);
        alert('Erro ao excluir plano anual.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThemeChange = (index: number, value: string) => {
    setFormData(prev => {
      const newThemes = [...(prev.quarter_themes || [])];
      newThemes[index] = value;
      return {
        ...prev,
        quarter_themes: newThemes
      };
    });
  };

  return (
    <div className="dashboard-container">
      <Header user={user} />

      <div className="content-grid">
        <div className="card">
          <h3>Gerador de Plano Anual</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Disciplina *</label>
              <input
                type="text"
                name="discipline"
                value={formData.discipline}
                onChange={handleChange}
                placeholder="Ex: Ciências"
                required
              />
            </div>
            <div className="form-group">
              <label>Série/Ano *</label>
              <select
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                required
              >
                <option value="">Selecione a série/ano</option>
                <option value="1º Ano Ensino Fundamental">1º Ano Ensino Fundamental</option>
                <option value="2º Ano Ensino Fundamental">2º Ano Ensino Fundamental</option>
                <option value="3º Ano Ensino Fundamental">3º Ano Ensino Fundamental</option>
                <option value="4º Ano Ensino Fundamental">4º Ano Ensino Fundamental</option>
                <option value="5º Ano Ensino Fundamental">5º Ano Ensino Fundamental</option>
                <option value="6º Ano Ensino Fundamental">6º Ano Ensino Fundamental</option>
                <option value="7º Ano Ensino Fundamental">7º Ano Ensino Fundamental</option>
                <option value="8º Ano Ensino Fundamental">8º Ano Ensino Fundamental</option>
                <option value="9º Ano Ensino Fundamental">9º Ano Ensino Fundamental</option>
                <option value="1º Ano Ensino Médio">1º Ano Ensino Médio</option>
                <option value="2º Ano Ensino Médio">2º Ano Ensino Médio</option>
                <option value="3º Ano Ensino Médio">3º Ano Ensino Médio</option>
              </select>
            </div>

            <div className="form-group">
              <label>Temas dos Bimestres (Opcional)</label>
              <div className="themes-grid">
                {[
                  "Ex: A Terra no Universo e os movimentos da Terra",
                  "Ex: Matéria, suas transformações e fontes de energia",
                  "Ex: Seres vivos, organização e relações ecológicas",
                  "Ex: Corpo humano, saúde e qualidade de vida"
                ].map((placeholder, index) => (
                  <div key={index} className="theme-input-wrapper">
                    <label className="theme-label">{index + 1}º Bimestre</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={formData.quarter_themes?.[index] || ''}
                      onChange={(e) => handleThemeChange(index, e.target.value)}
                      className="theme-input"
                    />
                  </div>
                ))}
              </div>
              <small className="form-help">Deixe em branco para que a IA sugira os temas.</small>
            </div>

            <div className="form-group">
              <label>Contexto Adicional (Opcional)</label>
              <textarea
                name="additional_context"
                value={formData.additional_context}
                onChange={handleChange}
                placeholder="Ex: Focar em atividades práticas, turma com dificuldades em leitura, etc."
                rows={3}
              />
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Gerando...' : 'Gerar Plano Anual'}
            </button>
          </form>
        </div>

                <div className="card">
          <h3>Planos Anuais Gerados</h3>
          {plans.length === 0 ? (
            <p className="no-materials">Nenhum plano anual gerado ainda.</p>
          ) : (
            <div className="materials-list">
              {plans.map(plan => (
                <MaterialCard
                  key={plan.id}
                  title={plan.discipline}
                  subtitle={<p><strong>Série:</strong> {plan.serie}</p>}
                  date={plan.created_at}
                  viewLink={`/annual-plan/${plan.id}`}
                  onDelete={() => handleDelete(plan.id)}
                  onDownloadDocx={() => documentService.generateAnnualPlanDocx(plan)}
                  onDownloadPdf={() => documentService.generateAnnualPlanPdf(plan)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnualPlanGenerator;
