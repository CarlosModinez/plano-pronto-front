import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import type { Material, AnnualPlan, DidacticSequence } from '../types';

export const documentService = {
  _createDocxBlob: async (data: any, templateName: string): Promise<Blob> => {
    // Load the template
    const response = await fetch(templateName);
    if (!response.ok) {
      throw new Error(`Template não encontrado. Por favor, adicione o arquivo "${templateName}" na pasta public.`);
    }
    const content = await response.arrayBuffer();

    const zip = new PizZip(content);
    
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '{{', end: '}}' }
    });

    // Render the document
    doc.render(data);

    // Generate the file
    return doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  },

  _generateHtmlPdf: (element: HTMLElement | string, filename: string) => {
    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // @ts-ignore
    return html2pdf().set(opt).from(element).save();
  },

  _generateMaterialHtml: (material: Material) => {
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');
    
    let html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">${material.theme}</h1>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.9em; color: #666;">
            <span style="background: #f0f2f5; padding: 4px 8px; border-radius: 4px;">${material.discipline}</span>
            <span style="background: #f0f2f5; padding: 4px 8px; border-radius: 4px;">${material.serie}</span>
            <span style="background: #f0f2f5; padding: 4px 8px; border-radius: 4px;">${material.duration} min</span>
            <span>Criado em: ${formatDate(material.created_at)}</span>
          </div>
        </div>
    `;

    const addSection = (title: string, content: string | string[] | undefined) => {
      if (!content || (Array.isArray(content) && content.length === 0)) return '';
      
      let contentHtml = '';
      if (Array.isArray(content)) {
        contentHtml = `<ul>${content.map(item => `<li style="margin-bottom: 5px;">${item}</li>`).join('')}</ul>`;
      } else {
        contentHtml = `<p style="white-space: pre-wrap;">${content}</p>`;
      }

      return `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-bottom: 15px;">${title}</h3>
          ${contentHtml}
        </div>
      `;
    };

    html += addSection('Fundamentação', material.foundation);
    html += addSection('Objetivo Geral', material.general_objective);
    html += addSection('Objetivos Específicos', material.specific_objectives);
    html += addSection('Conteúdo', material.content);
    html += addSection('Metodologia', material.methodology);
    html += addSection('Recursos Didáticos', material.resources);
    html += addSection('Avaliação', material.evaluation);
    html += addSection('Atividades de Casa', material.homework);
    html += addSection('Adaptações', material.adaptations);
    html += addSection('Habilidades', material.skills);

    html += '</div>';
    return html;
  },

  _generateAnnualPlanHtml: (plan: AnnualPlan) => {
    const formatDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '';
    
    let html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Plano Anual: ${plan.discipline}</h1>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.9em; color: #666;">
            <span style="background: #f0f2f5; padding: 4px 8px; border-radius: 4px;">${plan.serie}</span>
            <span>Criado em: ${formatDate(plan.created_at)}</span>
          </div>
        </div>
    `;

    const addSection = (title: string, content: string | string[] | undefined) => {
      if (!content || (Array.isArray(content) && content.length === 0)) return '';
      let contentHtml = Array.isArray(content) 
        ? `<ul>${content.map(item => `<li style="margin-bottom: 5px;">${item}</li>`).join('')}</ul>`
        : `<p style="white-space: pre-wrap;">${content}</p>`;
      return `<div style="margin-bottom: 25px;"><h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-bottom: 15px;">${title}</h3>${contentHtml}</div>`;
    };

    html += addSection('Área de Conhecimento', plan.area_conhecimento);
    html += addSection('Conceito Geral', plan.conceito_geral);
    html += addSection('Objetivo Geral', plan.objetivo_geral);
    html += addSection('Objetivos Específicos', plan.objetivo_especifico);
    html += addSection('Competências', plan.competencias);
    html += addSection('Conhecimentos e Habilidades', plan.conhecimentos_habilidades);

    const renderBimestre = (label: string, bimestre: any) => {
      if (!bimestre || !bimestre.tema) return '';
      
      let bHtml = `<div style="margin-top: 30px; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h3 style="color: #2c3e50; margin-top: 0;">${label}</h3>
        <p><strong>Tema:</strong> ${bimestre.tema}</p>`;
      
      const addSubSection = (subTitle: string, items: string[]) => {
        if (!items || items.length === 0) return '';
        return `<h4>${subTitle}</h4><ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
      };

      bHtml += addSubSection('Etapas', bimestre.etapas);
      bHtml += addSubSection('Metodologia', bimestre.metodologia);
      bHtml += addSubSection('Recursos', bimestre.recursos);
      bHtml += addSubSection('Avaliações', bimestre.avaliacoes);
      bHtml += addSubSection('Referências', bimestre.referencias);
      
      bHtml += '</div>';
      return bHtml;
    };

    html += renderBimestre('Primeiro Bimestre', plan.primeiro_bimestre);
    html += renderBimestre('Segundo Bimestre', plan.segundo_bimestre);
    html += renderBimestre('Terceiro Bimestre', plan.terceiro_bimestre);
    html += renderBimestre('Quarto Bimestre', plan.quarto_bimestre);

    html += '</div>';
    return html;
  },

  _generateDidacticSequenceHtml: (sequence: DidacticSequence) => {
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');
    
    let html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">${sequence.titulo || sequence.tema || 'Sequência Didática'}</h1>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.9em; color: #666;">
            <span style="background: #f0f2f5; padding: 4px 8px; border-radius: 4px;">${sequence.disciplina}</span>
            <span style="background: #f0f2f5; padding: 4px 8px; border-radius: 4px;">${sequence.serie}</span>
            ${sequence.created_at ? `<span>Criado em: ${formatDate(sequence.created_at)}</span>` : ''}
          </div>
        </div>
    `;

    if (sequence.objetivo_principal) {
      html += `<div style="margin-bottom: 25px;"><h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-bottom: 15px;">Objetivo Principal</h3><p>${sequence.objetivo_principal}</p></div>`;
    }

    if (sequence.habilidades_bncc && sequence.habilidades_bncc.length > 0) {
      html += `<div style="margin-bottom: 25px;"><h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-bottom: 15px;">Habilidades da BNCC</h3><ul>${sequence.habilidades_bncc.map(h => `<li>${h}</li>`).join('')}</ul></div>`;
    }

    if (sequence.dias && sequence.dias.length > 0) {
      html += `<div style="margin-bottom: 25px;"><h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-bottom: 15px;">Sequência de Aulas</h3>`;
      
      sequence.dias.forEach(dia => {
        html += `<div style="margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <h4 style="margin-top: 0; color: #2c3e50;">Dia ${dia.numero}: ${dia.titulo}</h4>`;
        
        if (dia.atividades) {
          dia.atividades.forEach(atividade => {
            html += `<div style="margin-top: 15px; padding-left: 15px; border-left: 2px solid #ddd;">
              <h5 style="margin: 0 0 10px 0;">Atividade ${atividade.numero}: ${atividade.nome}</h5>
              <p style="margin: 5px 0;"><strong>Metodologia:</strong> ${atividade.metodologia}</p>
              <p style="margin: 5px 0;"><strong>Recursos:</strong> ${atividade.recursos}</p>
              <p style="margin: 5px 0;"><strong>Descrição:</strong> ${atividade.descricao}</p>
            </div>`;
          });
        }
        html += `</div>`;
      });
      html += `</div>`;
    }

    if (sequence.avaliacao) {
      html += `<div style="margin-bottom: 25px;"><h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-bottom: 15px;">Avaliação</h3><p>${sequence.avaliacao}</p></div>`;
    }

    if (sequence.consideracoes_finais) {
      html += `<div style="margin-bottom: 25px;"><h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-bottom: 15px;">Considerações Finais</h3><p>${sequence.consideracoes_finais}</p></div>`;
    }

    html += '</div>';
    return html;
  },

  _generateExamHtml: (exam: any) => {
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');

    let html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">${exam.titulo_prova}</h1>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.9em; color: #666;">
            <span style="background: #f0f2f5; padding: 4px 8px; border-radius: 4px;">${exam.discipline}</span>
            <span style="background: #f0f2f5; padding: 4px 8px; border-radius: 4px;">${exam.serie}</span>
            <span>Criado em: ${formatDate(exam.created_at)}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
           <p><strong>Instruções:</strong> ${exam.instrucoes}</p>
        </div>
    `;

    html += `<div style="margin-bottom: 25px;"><h3 style="color: #2c3e50; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">Questões</h3>`;
    
    exam.questoes.forEach((q: any) => {
      html += `<div style="margin-bottom: 20px;">
        <p><strong>${q.numero}.</strong> ${q.enunciado} <span style="color: #666; font-size: 0.9em;">(Valor: ${q.valor})</span></p>`;
      
      if (q.alternativas && q.alternativas.length > 0) {
         html += '<ul style="list-style-type: none; padding-left: 20px;">';
         q.alternativas.forEach((alt: string) => {
           html += `<li style="margin-bottom: 5px;">${alt}</li>`;
         });
         html += '</ul>';
      }
      
      if (q.afirmacoes && q.afirmacoes.length > 0) {
        html += '<ul style="list-style-type: none; padding-left: 20px;">';
        q.afirmacoes.forEach((af: string) => {
           html += `<li style="margin-bottom: 5px;">[ ] ${af}</li>`;
        });
        html += '</ul>';
      }

      html += `</div>`;
    });
    html += `</div>`;

    html += `<div style="margin-top: 30px; page-break-before: always;">
      <h3 style="color: #2c3e50; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">Gabarito e Explicações</h3>`;
    
    exam.gabarito.forEach((g: any) => {
      html += `<div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 6px;">
        <p style="margin: 0; font-weight: bold;">Questão ${g.numero}: ${g.resposta}</p>
        <p style="margin: 5px 0 0 0; font-style: italic;">${g.explicacao}</p>
      </div>`;
    });
    
    html += `</div></div>`;

    return html;
  },

  generateDocx: async (material: Material) => {
    try {
      const data = prepareData(material);
      const blob = await documentService._createDocxBlob(data, 'PLANO_AULA_DIARIO.docx');
      saveAs(blob, `Plano_de_Aula_${material.theme.replace(/\s+/g, '_')}.docx`);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro ao gerar o documento. Verifique se o template está disponível.');
    }
  },

  generateAnnualPlanDocx: async (plan: AnnualPlan) => {
    try {
      const data = prepareAnnualPlanData(plan);
      const blob = await documentService._createDocxBlob(data, 'PLANO_AULA_ANUAL.docx');
      saveAs(blob, `Plano_Anual_${plan.discipline.replace(/\s+/g, '_')}.docx`);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro ao gerar o documento. Verifique se o template está disponível.');
    }
  },

  generateDidacticSequenceDocx: async (sequence: DidacticSequence) => {
    try {
      const data = prepareDidacticSequenceData(sequence);
      const blob = await documentService._createDocxBlob(data, 'TEMPLATE_SEQUENCIA_AULA.docx');
      saveAs(blob, `Sequencia_Didatica_${sequence.tema?.replace(/\s+/g, '_') || 'Nova'}.docx`);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro ao gerar o documento. Verifique se o template está disponível.');
    }
  },

  generatePdf: async (material: Material) => {
    try {
      const html = documentService._generateMaterialHtml(material);
      await documentService._generateHtmlPdf(html, `Plano_de_Aula_${material.theme.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF.');
    }
  },

  generateAnnualPlanPdf: async (plan: AnnualPlan) => {
    try {
      const html = documentService._generateAnnualPlanHtml(plan);
      await documentService._generateHtmlPdf(html, `Plano_Anual_${plan.discipline.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF.');
    }
  },

  generateDidacticSequencePdf: async (sequence: DidacticSequence) => {
    try {
      const html = documentService._generateDidacticSequenceHtml(sequence);
      await documentService._generateHtmlPdf(html, `Sequencia_Didatica_${sequence.tema?.replace(/\s+/g, '_') || 'Nova'}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF.');
    }
  },

  generateExamDocx: async (exam: any) => {
    try {
      const data = prepareExamData(exam);
      const blob = await documentService._createDocxBlob(data, 'EXAME.docx');
      saveAs(blob, `Exame_${exam.tema?.replace(/\s+/g, '_') || 'Novo'}.docx`);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro ao gerar o documento. Verifique se o template EXAME.docx está disponível na pasta public.');
    }
  },

  generateExamPdf: async (exam: any) => {
    try {
      const html = documentService._generateExamHtml(exam);
      await documentService._generateHtmlPdf(html, `Exame_${exam.tema?.replace(/\s+/g, '_') || 'Novo'}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF.');
    }
  }
};

const prepareExamData = (exam: any) => {
  let questions = "";

  exam.questoes.forEach((q: any) => {
    questions += `${q.numero}. ${q.enunciado} (Valor: ${q.valor})\n`;
    if (q.alternativas && q.alternativas.length > 0) {
      q.alternativas.forEach((alt: string) => {
        questions += `${alt}\n`;
      });
    }
    if (q.tipo === 'verdadeiro_falso' && q.afirmacoes) {
        q.afirmacoes.forEach((opt: string) => {
             questions += `( ) ${opt}\n`;
        });
    } else if (q.tipo === 'dissertativa') {
       questions += `___________________________________________________________________\n`;
       questions += `___________________________________________________________________\n`;
    }
    questions += '\n';
  });

  let gabarito = "";
  if (exam.gabarito) {
    gabarito += `GABARITO\n\n`;
    exam.gabarito.forEach((g: any) => {
      gabarito += `${g.numero}. ${g.resposta}\n`;
      gabarito += `Explicação: ${g.explicacao}\n\n`;
    });
  }

  // Se o usuário não incluiu a tag GABARITO, podemos decidir se concatenamos ou não.
  // Pela solicitação, ele pediu campos específicos. Vamos fornecer os campos chaves.
  // Vou incluir o GABARITO como um campo extra caso ele queira usar {{GABARITO}}.

  return { 
    TITULO: exam.titulo_prova,
    DISCIPLINA: exam.discipline,
    TURMA: exam.serie,
    TEMA: exam.tema,
    INSTRUCOES: exam.instrucoes,
    QUESTOES: questions,
    GABARITO: gabarito
  };
};

const prepareData = (material: Material) => {
  const campos_com_marcadores = [
    "OBJETIVO_ESPECIFICO", "CONHECIMENTOS_HABILIDADES", "CONTEUDO",
    "RECURSOS_DIDATICOS", "AVALIACAO",
    "ATIVIDADES_CASA", "ADAPTACOES", "TURMA"
  ];

  const replacements: any = {
    DISCIPLINA: material.discipline,
    SERIE: material.serie,
    TEMA: material.theme,
    DURACAO: material.duration,
    FUNDAMENTO_AULA: material.foundation,
    OBJETIVO_GERAL: material.general_objective,
    OBJETIVO_ESPECIFICO: material.specific_objectives,
    CONHECIMENTOS_HABILIDADES: material.skills,
    CONTEUDO: material.content,
    RECURSOS_DIDATICOS: material.resources,
    METODOLOGIA: material.methodology,
    AVALIACAO: material.evaluation,
    ATIVIDADES_CASA: material.homework,
    ADAPTACOES: material.adaptations,
    TURMA: material.serie
  };

  const normalized: any = {};

  for (const key in replacements) {
    const value = replacements[key];
    
    if (Array.isArray(value)) {
      if (key === "METODOLOGIA") {
        normalized[key] = value.join("\n\n");
      } else if (campos_com_marcadores.includes(key)) {
        normalized[key] = value.map((item: string) => `• ${item}`).join("\n");
      } else {
        normalized[key] = value.join("\n");
      }
    } else {
      normalized[key] = value || "";
    }
  }

  return normalized;
};

const prepareAnnualPlanData = (plan: AnnualPlan) => {
  const formatList = (list?: string[]) => {
    if (!list || list.length === 0) return "";
    return list.map(item => `• ${item}`).join("\n");
  };

  const formatBimestre = (bimestre: any, prefix: string) => {
    if (!bimestre) return {};
    return {
      [`${prefix}_TEMA`]: bimestre.tema || "",
      [`${prefix}_ETAPAS_APRENDIZAGEM`]: formatList(bimestre.etapas),
      [`${prefix}_METODOLOGIA_ENSINO`]: formatList(bimestre.metodologia),
      [`${prefix}_RECURSOS_DIDATICOS`]: formatList(bimestre.recursos),
      [`${prefix}_AVALIACOES`]: formatList(bimestre.avaliacoes),
      [`${prefix}_REFERENCIAS_BIBLIOGRAFICAS`]: formatList(bimestre.referencias),
    };
  };

  return {
    TURMA: plan.serie,
    DISCIPLINA: plan.discipline,
    AREA_CONHECIMENTO: plan.area_conhecimento || "",
    CONCEITO_GERAL: plan.conceito_geral || "",
    OBJETIVO_GERAL: plan.objetivo_geral || "",
    OBJETIVO_ESPECIFICO: formatList(plan.objetivo_especifico),
    COMPETENCIAS: formatList(plan.competencias),
    CONHECIMENTOS_HABILIDADES: formatList(plan.conhecimentos_habilidades),
    ANO_ATUAL: new Date().getFullYear(),
    ...formatBimestre(plan.primeiro_bimestre, "PRIMEIRO"),
    ...formatBimestre(plan.segundo_bimestre, "SEGUNDO"),
    ...formatBimestre(plan.terceiro_bimestre, "TERCEIRO"),
    ...formatBimestre(plan.quarto_bimestre, "QUARTO"),
  };
};

const prepareDidacticSequenceData = (sequence: DidacticSequence) => {
  const data: any = {
    TURMA: sequence.serie || "",
    DISCIPLINA: sequence.disciplina || "",
    TEMA: sequence.tema || "",
    OBJETIVO_PRINCIPAL: sequence.objetivo_principal || "",
    "HABILIDADES BNCC": sequence.habilidades_bncc ? sequence.habilidades_bncc.join("\n") : "",
    "HABILIDADES_BNCC": sequence.habilidades_bncc ? sequence.habilidades_bncc.join("\n") : "", // Fallback for underscore
    AVALIACAO: sequence.avaliacao || "",
    CONSIDERACOES_FINAIS: sequence.consideracoes_finais || "",
  };

  // Initialize all day/activity fields with empty strings
  for (let i = 1; i <= 5; i++) {
    data[`TITULO_${i}`] = "";
    for (let j = 1; j <= 3; j++) {
      data[`NOME_DIA_${i}_ATIVIDADE_${j}`] = "";
      data[`DESCRICAO_DIA_${i}_ATIVIDADE_${j}`] = "";
      data[`METODOLOGIA_DIA_${i}_ATIVIDADE_${j}`] = "";
      data[`RECURSOS_DIA_${i}_ATIVIDADE_${j}`] = "";
    }
  }

  // Fill with actual data
  if (sequence.dias) {
    sequence.dias.forEach((dia, index) => {
      const dayNum = index + 1;
      if (dayNum > 5) return;

      data[`TITULO_${dayNum}`] = dia.titulo || "";

      if (dia.atividades) {
        dia.atividades.forEach((atividade, atIndex) => {
          const atNum = atIndex + 1;
          if (atNum > 3) return;

          data[`NOME_DIA_${dayNum}_ATIVIDADE_${atNum}`] = atividade.nome || "";
          data[`DESCRICAO_DIA_${dayNum}_ATIVIDADE_${atNum}`] = atividade.descricao || "";
          data[`METODOLOGIA_DIA_${dayNum}_ATIVIDADE_${atNum}`] = atividade.metodologia || "";
          data[`RECURSOS_DIA_${dayNum}_ATIVIDADE_${atNum}`] = atividade.recursos || "";
        });
      }
    });
  }

  return data;
};
