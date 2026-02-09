import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examService } from '../services/api';
import { documentService } from '../services/documentService';
import type { Exam, User } from '../types';
import Header from '../components/Header';
import ContentDetailsLayout from '../components/ContentDetailsLayout';
import './LessonPlanDetails.css'; // Reusing CSS

const ExamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (id) {
      loadExam(id);
    }
  }, [id]);

  const loadExam = async (examId: string) => {
    try {
      const data = await examService.getById(examId);
      setExam(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar a prova.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="dashboard-container">
      <Header user={user} />
      <div className="loading">Carregando...</div>
    </div>
  );

  if (error) return (
    <div className="dashboard-container">
      <Header user={user} />
      <div className="details-container" style={{ color: 'red' }}>{error}</div>
    </div>
  );

  if (!exam) return (
    <div className="dashboard-container">
      <Header user={user} />
      <div className="details-container">Prova não encontrada.</div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Header user={user} />
      <ContentDetailsLayout
        title={exam.titulo_prova}
        subtitle={
          <>
            <span className="tag">{exam.discipline}</span>
            <span className="tag">{exam.serie}</span>
            <span className="details-date">Criado em: {exam.created_at ? new Date(exam.created_at).toLocaleDateString() : ''}</span>
          </>
        }
        onBack={() => navigate('/exams')}
        onDownloadDocx={() => documentService.generateExamDocx(exam)}
        onDownloadPdf={() => documentService.generateExamPdf(exam)}
      >
        <div className="details-grid">
           <section className="details-section full-width">
              <h3>Instruções</h3>
              <p>{exam.instrucoes}</p>
            </section>

             <section className="details-section full-width">
                <h3>Questões</h3>
                {exam.questoes.map((q) => (
                    <div key={q.numero} className="exam-question-item" style={{ marginBottom: '20px' }}>
                        <p style={{ fontWeight: 'bold' }}>{q.numero}. {q.enunciado} <span style={{ color: '#666', fontSize: '0.9em' }}>(Valor: {q.valor})</span></p>
                        
                        {q.alternativas && (
                            <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
                                {q.alternativas.map((alt, i) => (
                                    <li key={i} style={{ marginBottom: '5px' }}>{alt}</li>
                                ))}
                            </ul>
                        )}

                        {q.afirmacoes && (
                             <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
                                {q.afirmacoes.map((af, i) => (
                                    <li key={i} style={{ marginBottom: '5px' }}>[ ] {af}</li>
                                ))}
                             </ul>
                        )}
                    </div>
                ))}
            </section>

             <section className="details-section full-width">
                <h3>Gabarito</h3>
                {exam.gabarito.map((g) => (
                    <div key={g.numero} className="exam-answer-item" style={{ marginBottom: '15px' }}>
                        <p style={{ fontWeight: 'bold' }}>Questão {g.numero}: {g.resposta}</p>
                        <p style={{ fontStyle: 'italic', marginTop: '5px' }}>{g.explicacao}</p>
                    </div>
                ))}
            </section>
        </div>
      </ContentDetailsLayout>
    </div>
  );
};

export default ExamDetails;
