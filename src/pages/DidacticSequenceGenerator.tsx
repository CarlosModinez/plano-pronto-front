import React, { useState, useEffect } from 'react';
import { didacticSequenceService } from '../services/api';
import { documentService } from '../services/documentService';
import type { User, DidacticSequenceRequest, DidacticSequence } from '../types';
import Header from '../components/Header';
import MaterialCard from '../components/MaterialCard';
import InsufficientCreditsModal from '../components/InsufficientCreditsModal';
import './Dashboard.css';

const DidacticSequenceGenerator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [sequences, setSequences] = useState<DidacticSequence[]>([]);
  const [formData, setFormData] = useState<DidacticSequenceRequest>({
    serie: '',
    disciplina: '',
    tema: '',
    objetivo_principal: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadSequences();
  }, []);

  const loadSequences = async () => {
    try {
      const data = await didacticSequenceService.list();
      setSequences(data.sequences || []);
      
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, credits: data.credits };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error('Erro ao carregar sequências:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await didacticSequenceService.create(formData);
      await loadSequences();
      setFormData({
        serie: '',
        disciplina: '',
        tema: '',
        objetivo_principal: '',
      });
      alert('Sequência Didática gerada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar sequência:', error);
      if (error.response?.data?.error.toLowerCase().includes("insufficient credits")) {
        setShowCreditModal(true);
      } else {
        alert('Erro ao gerar sequência didática.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta sequência didática?')) {
      try {
        await didacticSequenceService.delete(id);
        setSequences(sequences.filter(seq => seq.id !== id));
      } catch (error) {
        console.error('Erro ao excluir sequência:', error);
        alert('Erro ao excluir sequência didática.');
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
          <h3>Gerador de Sequência Didática</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Disciplina *</label>
              <input
                type="text"
                name="disciplina"
                value={formData.disciplina}
                onChange={handleChange}
                placeholder="Ex: Ciências"
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
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
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
                name="tema"
                value={formData.tema}
                onChange={handleChange}
                placeholder="Ex: Ciclo da Água"
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>
            <div className="form-group">
              <label>Objetivo Principal *</label>
              <textarea
                name="objetivo_principal"
                value={formData.objetivo_principal}
                onChange={handleChange}
                placeholder="Ex: Compreender as etapas do ciclo da água e sua importância para o meio ambiente."
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Por favor, preencha este campo.')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Gerando...' : 'Gerar Sequência'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Sequências Didáticas Geradas</h3>
          {sequences.length === 0 ? (
            <p className="no-materials">Nenhuma sequência didática gerada ainda.</p>
          ) : (
            <div className="materials-list">
              {sequences.map(seq => (
                <MaterialCard
                  key={seq.id}
                  title={seq.titulo || seq.tema || 'Sem título'}
                  subtitle={
                    <>
                      <p><strong>Disciplina:</strong> {seq.disciplina}</p>
                      <p><strong>Série:</strong> {seq.serie}</p>
                    </>
                  }
                  date={seq.created_at}
                  viewLink={`/didactic-sequence/${seq.id}`}
                  onDelete={() => handleDelete(seq.id)}
                  onDownloadDocx={() => documentService.generateDidacticSequenceDocx(seq)}
                  onDownloadPdf={() => documentService.generateDidacticSequencePdf(seq)}
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

export default DidacticSequenceGenerator;
