import React, { useState, useEffect } from 'react';
import { examService } from '../services/api';
import { documentService } from '../services/documentService';
import type { User, ExamRequest, Exam } from '../types';
import Header from '../components/Header';
import MaterialCard from '../components/MaterialCard';
import InsufficientCreditsModal from '../components/InsufficientCreditsModal';
import './Dashboard.css';

const ExamGenerator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [formData, setFormData] = useState<ExamRequest>({
    discipline: '',
    serie: '',
    theme: '',
    numero_questoes: 10,
    tipos_questoes: ['multipla_escolha', 'dissertativa', 'verdadeiro_falso'],
    additional_context: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await examService.list();
      // Check if data is an array (direct list) or object with exams property
      const examsList = Array.isArray(data) ? data : (data.exams || []);
      setExams(examsList);
      
      // Update credits only if provided in response
      if (data.credits !== undefined) {
        setUser(prevUser => {
          if (!prevUser) return null;
          const updatedUser = { ...prevUser, credits: data.credits };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        });
      }
    } catch (error) {
      console.error('Erro ao carregar provas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await examService.create(formData);
      await loadExams();
      setFormData({
        discipline: '',
        serie: '',
        theme: '',
        numero_questoes: 10,
        tipos_questoes: ['multipla_escolha', 'dissertativa', 'verdadeiro_falso'],
        additional_context: '',
      });
      alert('Prova gerada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar prova:', error);
      if (error.response?.data?.error?.toLowerCase().includes("insufficient credits")) {
        setShowCreditModal(true);
      } else {
        alert('Erro ao gerar prova.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta prova?')) {
      try {
        await examService.delete(id);
        setExams(exams.filter(exam => String(exam.id) !== id));
      } catch (error) {
        console.error('Erro ao excluir prova:', error);
        alert('Erro ao excluir prova.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numero_questoes' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
        const currentTypes = prev.tipos_questoes;
        if (checked) {
            return { ...prev, tipos_questoes: [...currentTypes, value] };
        } else {
            return { ...prev, tipos_questoes: currentTypes.filter(t => t !== value) };
        }
    });
  };

  return (
    <div className="dashboard-container">
      <Header user={user} />

      <div className="content-grid">
        <div className="card">
          <h3>Nova Prova</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Disciplina *</label>
              <input
                type="text"
                name="discipline"
                value={formData.discipline}
                onChange={handleChange}
                placeholder="Ex: Matemática"
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>

            <div className="form-group">
              <label>Série/Ano *</label>
              <select
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                required
                onInvalid={(e) => (e.target as HTMLSelectElement).setCustomValidity('Por favor, selecione uma opção.')}
                onInput={(e) => (e.target as HTMLSelectElement).setCustomValidity('')}
              >
                <option value="">Selecione a série/ano</option>
                <option value="Berçário I">Berçário I</option>
                <option value="Berçário II">Berçário II</option>
                <option value="Maternal I">Maternal I</option>
                <option value="Maternal II">Maternal II</option>
                <option value="Pré-Escola I">Pré-Escola I</option>
                <option value="Pré-Escola II">Pré-Escola II</option>
                <option value="1º Ano Ensino Fundamental">1º Ano Ensino Fundamental</option>
                <option value="2º Ano Ensino Fundamental">2º Ano Ensino Fundamental</option>
                <option value="3º Ano Ensino Fundamental">3º Ano Ensino Fundamental</option>
                <option value="4º Ano Ensino Fundamental">4º Ano Ensino Fundamental</option>
                <option value="5º Ano Ensino Fundamental">5º Ano Ensino Fundamental</option>
                <option value="6º Ano Ensino Fundamental">6º Ano Ensino Fundamental</option>
                <option value="7º Ano Ensino Fundamental">7º Ano Ensino Fundamental</option>
                <option value="8º Ano Ensino Fundamental">8º Ano Ensino Fundamental</option>
                <option value="9º Ano Ensino Fundamental">9º Ano Ensino Fundamental</option>
                <option value="1ª Série Ensino Médio">1ª Série Ensino Médio</option>
                <option value="2ª Série Ensino Médio">2ª Série Ensino Médio</option>
                <option value="3ª Série Ensino Médio">3ª Série Ensino Médio</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tema *</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                placeholder="Ex: Frações"
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>

             <div className="form-group">
              <label>Número de Questões *</label>
              <input
                type="number"
                name="numero_questoes"
                value={formData.numero_questoes}
                onChange={handleChange}
                min={1}
                max={50}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipos de Questões *</label>
              <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    value="multipla_escolha"
                    checked={formData.tipos_questoes.includes('multipla_escolha')}
                    onChange={handleCheckboxChange}
                    style={{ marginRight: '5px' }}
                  />
                  Múltipla Escolha
                </label>
                <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    value="dissertativa"
                    checked={formData.tipos_questoes.includes('dissertativa')}
                    onChange={handleCheckboxChange}
                    style={{ marginRight: '5px' }}
                  />
                  Dissertativa
                </label>
                 <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    value="verdadeiro_falso"
                    checked={formData.tipos_questoes.includes('verdadeiro_falso')}
                    onChange={handleCheckboxChange}
                    style={{ marginRight: '5px' }}
                  />
                  Verdadeiro/Falso
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Contexto Adicional (Opcional)</label>
              <textarea
                name="additional_context"
                value={formData.additional_context || ''}
                onChange={handleChange}
                placeholder="Ex: Focar em problemas do cotidiano..."
                rows={3}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Prova'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Minhas Provas</h3>
          <div className="materials-list">
            {exams.length === 0 ? (
              <p className="no-materials">Nenhuma prova gerada ainda.</p>
            ) : (
              exams.map((exam) => (
                <MaterialCard
                  key={exam.id}
                  title={exam.titulo_prova}
                  date={exam.created_at}
                  subtitle={
                    <div className="material-tags">
                      <span>{exam.discipline}</span>
                      <span>{exam.serie}</span>
                    </div>
                  }
                  viewLink={`/exams/${exam.id}`}
                  onDownloadDocx={() => documentService.generateExamDocx(exam)}
                  onDownloadPdf={() => documentService.generateExamPdf(exam)}
                  onDelete={() => handleDelete(String(exam.id))}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <InsufficientCreditsModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
      />
    </div>
  );
};

export default ExamGenerator;
