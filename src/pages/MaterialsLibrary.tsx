import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import type { User } from '../types';
import './MaterialsLibrary.css';

// Placeholder data - replace link with actual Drive link provided by user later
const driveMaterials = [
  {
    id: 1,
    title: 'Kit fundamental 1',
    description: 'Materiais completos para o Ensino Fundamental 1, incluindo planos de aula e atividades.',
    thumbnail: null,
    link: 'https://drive.google.com/drive/folders/1o7jhxxPPHehwIaFaxPLsz0OLvNj14EQF',
    category: 'Fundamental 1'
  },
  {
    id: 2,
    title: 'Planos 2026 - Fundamental 2',
    description: 'Planejamentos atualizados para o ano letivo de 2026, focados no Fundamental 2.',
    thumbnail: null,
    link: 'https://drive.google.com/drive/folders/1WOJMZOwlHEAoSVHtR-GlSf0AIv6uPs0L',
    category: 'Fundamental 2'
  },
  {
    id: 3,
    title: 'Planos 2026 - Fundamental 1',
    description: 'Planejamentos atualizados para o ano letivo de 2026, focados no Fundamental 1.',
    thumbnail: null,
    link: 'https://drive.google.com/drive/folders/1hJlIrWenueBqmhZZcqMgLRQQwH0mDRj4',
    category: 'Fundamental 1'
  },
  {
    id: 4,
    title: 'Planos diários - Fundamental 1',
    description: 'Sugestões de planos de aula diários para auxiliar na rotina escolar do Fundamental 1.',
    thumbnail: null,
    link: 'https://drive.google.com/drive/folders/1i8-aGQLu9MlGaPNb5dQKKp0I6KMmgx3N',
    category: 'Fundamental 1'
  },
  {
    id: 5,
    title: 'Planos 2026 - Kit Educação Infantil',
    description: 'Recursos e planejamentos para a Educação Infantil, ano letivo de 2026.',
    thumbnail: null,
    link: 'https://drive.google.com/drive/folders/1n499-ugjYM7YqbtEhBNuyMQRYDgACOuR',
    category: 'Educação Infantil'
  }
];

const MaterialsLibrary: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes('infantil')) return 'text-purple-600 bg-purple-50';
    if (category.toLowerCase().includes('fundamental 2')) return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="materials-container">
        <div className="materials-title-section">
          <h2>Biblioteca de materiais</h2>
          <p>Reunimos aqui uma curadoria especial dos melhores materiais didáticos, desenvolvidos por professores e pela nossa equipe em parceria com diversas escolas. Esse acervo reúne conteúdos testados em sala de aula e agora está sendo disponibilizado como um bônus para apoiar e enriquecer sua prática pedagógica.</p>
        </div>

        <div className="materials-grid">
          {driveMaterials.map((material) => (
            <a 
              key={material.id} 
              href={material.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="drive-material-card"
            >
              <div className="material-thumbnail-container">
                {material.thumbnail ? (
                  <img 
                    src={material.thumbnail} 
                    alt={material.title} 
                    className="material-thumbnail"
                  />
                ) : (
                  <div className="material-preview-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#60A5FA" width="80" height="80">
                      <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                    </svg>
                  </div>
                )}
                <div className="drive-icon-overlay" title="Abrir no Google Drive">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 3h6v6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14L21 3" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className="material-content">
                <span className={`text-xs font-semibold px-2 py-1 rounded w-fit mb-2 ${getCategoryColor(material.category)}`}>
                  {material.category}
                </span>
                <h3 className="material-title">
                  {material.title}
                </h3>
                <p className="material-description">
                  {material.description}
                </p>
                
                <div className="material-footer">
                  <span className="drive-link-button">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Acessar Material
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MaterialsLibrary;
