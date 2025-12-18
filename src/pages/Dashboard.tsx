import React, { useState, useEffect } from 'react';
import { materialService } from '../services/api';
import { documentService } from '../services/documentService';
import type { Material, User } from '../types';
import Header from '../components/Header';
import MaterialCard from '../components/MaterialCard';
import InsufficientCreditsModal from '../components/InsufficientCreditsModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [formData, setFormData] = useState({
    discipline: '',
    serie: '',
    theme: '',
    duration: 50,
    additional_context: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const data = await materialService.list();
      setMaterials(data.materials);
      
      // Update user credits from server response
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, credits: data.credits };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano de aula?')) {
      try {
        await materialService.delete(id);
        setMaterials(materials.filter(material => material.id !== id));
      } catch (error) {
        console.error('Erro ao excluir material:', error);
        alert('Erro ao excluir plano de aula.');
      }
    }
  };

  const handleDownloadDocs = async (material: Material) => {
    await documentService.generateDocx(material);
  };

  const handleDownloadPdf = async (material: Material) => {
    await documentService.generatePdf(material);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await materialService.create(formData);
      await loadMaterials();
      setFormData({
        discipline: '',
        serie: '',
        theme: '',
        duration: 50,
        additional_context: '',
      });
      alert('Plano de aula gerado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar plano:', error);
      if (error.response?.data?.error.toLowerCase().includes("insufficient credits")) {
        setShowCreditModal(true);
      } else {
        alert('Erro ao gerar plano de aula.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value
    }));
  };

  return (
    <div className="dashboard-container">
      <Header user={user} />

      <div className="content-grid">
        <div className="card">
          <h3>Novo Plano de Aula</h3>
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
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                placeholder="Ex: Frações"
                required
              />
            </div>
            <div className="form-group">
              <label>Duração (minutos) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Contexto Adicional</label>
              <textarea
                name="additional_context"
                value={formData.additional_context}
                onChange={handleChange}
                placeholder="Ex: Turma com 25 alunos, incluindo 3 com necessidades especiais."
                rows={4}
              />
            </div>
            <button type="submit" className="submit-button">
              {loading ? 'Gerando...' : 'Gerar Plano'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Meus Planos de Aula</h3>
          <div className="materials-list">
            {materials.length === 0 ? (
              <p>Nenhum plano de aula encontrado.</p>
            ) : (
              materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  title={material.theme}
                  subtitle={
                    <>
                      <p><strong>Disciplina:</strong> {material.discipline} | <strong>Série:</strong> {material.serie}</p>
                      <p><strong>Duração:</strong> {material.duration} min</p>
                    </>
                  }
                  date={material.created_at}
                  viewLink={`/materials/${material.id}`}
                  onDelete={() => handleDelete(material.id)}
                  onDownloadDocx={() => handleDownloadDocs(material)}
                  onDownloadPdf={() => handleDownloadPdf(material)}
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

export default Dashboard;
