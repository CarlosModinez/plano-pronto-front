import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { renderAsync } from 'docx-preview';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import type { Material } from '../types';

export const documentService = {
  _createDocxBlob: async (material: Material): Promise<Blob> => {
    // Load the template
    const response = await fetch('/plano_de_aula_template.docx');
    if (!response.ok) {
      throw new Error('Template não encontrado. Por favor, adicione o arquivo "plano_de_aula_template.docx" na pasta public.');
    }
    const content = await response.arrayBuffer();

    const zip = new PizZip(content);
    
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '{{', end: '}}' }
    });

    // Prepare data
    const data = prepareData(material);

    // Render the document
    doc.render(data);

    // Generate the file
    return doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  },

  generateDocx: async (material: Material) => {
    try {
      const blob = await documentService._createDocxBlob(material);
      saveAs(blob, `Plano_de_Aula_${material.theme.replace(/\s+/g, '_')}.docx`);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro ao gerar o documento. Verifique se o template está disponível.');
    }
  },

  generatePdf: async (material: Material) => {
    try {
      const blob = await documentService._createDocxBlob(material);
      
      // Create a temporary container for rendering
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm'; // A4 width
      container.style.backgroundColor = 'white';
      container.style.color = 'black'; // Ensure text color
      
      document.body.appendChild(container);

      // Render DOCX to HTML
      // inWrapper: false renders just the content, which is better for PDF generation
      await renderAsync(blob, container, container, {
        inWrapper: false, 
        ignoreWidth: false,
        ignoreHeight: false
      });

      // Configure PDF options
      const opt = {
        margin: 10,
        filename: `Plano_de_Aula_${material.theme.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate PDF
      await html2pdf().set(opt).from(container).save();

      // Cleanup
      document.body.removeChild(container);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Verifique se o template está disponível.');
    }
  }
};

const prepareData = (material: Material) => {
  const campos_com_marcadores = [
    "OBJETIVO_ESPECIFICO", "CONHECIMENTOS_HABILIDADES", "CONTEUDO",
    "RECURSOS_DIDATICOS", "AVALIACAO",
    "ATIVIDADES_CASA", "ADAPTACOES"
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
