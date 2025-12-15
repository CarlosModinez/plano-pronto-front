import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
// @ts-ignore
import PSPDFKit from 'pspdfkit';
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

  _generatePdfWithPspdfkit: async (docxBlob: Blob, filename: string) => {
    const objectUrl = URL.createObjectURL(docxBlob);
    const container = document.createElement('div');
    // Position off-screen but keep it "visible" to the DOM so PSPDFKit can render
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '1000px';
    container.style.height = '1000px';
    document.body.appendChild(container);

    try {
      // @ts-ignore
      const instance = await PSPDFKit.load({
        container,
        document: objectUrl,
        baseUrl: `${window.location.protocol}//${window.location.host}/pspdfkit-lib/`,
      });
      
      const pdfBuffer = await instance.exportPDF();
      const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
      saveAs(pdfBlob, filename);
      
      URL.revokeObjectURL(objectUrl);
      PSPDFKit.unload(container);
    } catch (error) {
      console.error('PSPDFKit error:', error);
      alert('Erro ao gerar PDF. Verifique se os arquivos da biblioteca PSPDFKit estão na pasta public/pspdfkit-lib.');
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
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
      const data = prepareData(material);
      const blob = await documentService._createDocxBlob(data, 'PLANO_AULA_DIARIO.docx');
      await documentService._generatePdfWithPspdfkit(blob, `Plano_de_Aula_${material.theme.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF.');
    }
  },

  generateAnnualPlanPdf: async (plan: AnnualPlan) => {
    try {
      const data = prepareAnnualPlanData(plan);
      const blob = await documentService._createDocxBlob(data, 'PLANO_AULA_ANUAL.docx');
      await documentService._generatePdfWithPspdfkit(blob, `Plano_Anual_${plan.discipline.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF.');
    }
  },

  generateDidacticSequencePdf: async (sequence: DidacticSequence) => {
    try {
      const data = prepareDidacticSequenceData(sequence);
      const blob = await documentService._createDocxBlob(data, 'TEMPLATE_SEQUENCIA_AULA.docx');
      await documentService._generatePdfWithPspdfkit(blob, `Sequencia_Didatica_${sequence.tema?.replace(/\s+/g, '_') || 'Nova'}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF.');
    }
  }
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
