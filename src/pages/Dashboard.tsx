import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { materialService, authService } from '../services/api';
import { documentService } from '../services/documentService';
import type { Material, User } from '../types';
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
  const navigate = useNavigate();

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
      setMaterials(data);
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
      if (error.response?.data?.error === "Insufficient credits. Please purchase a package.") {
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
      <header className="dashboard-header">
        <div className="header-left">
          <img src="/logo.png" alt="Logo" className="header-logo" />
          <div>
            <h1>Gerador de Planos de Aula</h1>
            {user && <p className="user-info">Bem-vindo, <strong>{user.name}</strong> | Créditos: <strong>{user.credits}</strong></p>}
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </header>

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
              />
            </div>
            <div className="form-group">
              <label>Duração (minutos) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
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
            <button type="submit" className="submit-button" disabled={loading || !formData.discipline || !formData.serie || !formData.theme || !formData.duration}>
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
                <div key={material.id} className="material-item">
                  <div className="material-header">
                    <span className="material-title">{material.theme}</span>
                    <span className="material-date">{new Date(material.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="material-details">
                    <p><strong>Disciplina:</strong> {material.discipline} | <strong>Série:</strong> {material.serie}</p>
                    <p><strong>Duração:</strong> {material.duration} min</p>
                  </div>
                  <div className="material-actions">
                    <Link to={`/materials/${material.id}`} className="action-button view-button">Ver Detalhes</Link>
                    <button onClick={() => handleDownloadPdf(material)} className="action-button download-button">Baixar PDF</button>
                    <button onClick={() => handleDownloadDocs(material)} className="action-button download-button">Baixar DOCX</button>
                    <button onClick={() => handleDelete(material.id)} className="action-button delete-button">Excluir</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showCreditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Saldo Insuficiente</h2>
              <button className="close-button" onClick={() => setShowCreditModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Você não possui créditos suficientes para gerar um novo plano de aula.</p>
              <p>Adquira um novo pacote de créditos para continuar aproveitando nossa ferramenta.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowCreditModal(false)}>Cancelar</button>
              <Link to="https://payfast.greenn.com.br/148992" className="buy-credits-button">Comprar Créditos</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
