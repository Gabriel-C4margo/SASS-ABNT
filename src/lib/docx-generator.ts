import { Document as DocxDocument, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Document, Block, Advisor } from '@/types/document';

export class DocxGenerator {
  private document: Document;

  constructor(document: Document) {
    this.document = document;
  }

  private createCoverPage(): Paragraph[] {
    const { info } = this.document;
    
    return [
      // Instituição
      new Paragraph({
        children: [
          new TextRun({
            text: info.institution.toUpperCase(),
            font: 'Arial',
            size: 24,
            bold: false,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 2500 }, // Espaço maior após instituição
      }),
      
      // Autor
      new Paragraph({
        children: [
          new TextRun({
            text: info.author.toUpperCase(),
            font: 'Arial',
            size: 24,
            bold: false,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 3500 }, // Espaço maior para centralizar na página
      }),
      
      // Título e Subtítulo
      new Paragraph({
        children: [
          new TextRun({
            text: info.title.toUpperCase() + (info.subtitle ? `: ${info.subtitle.toUpperCase()}` : ''),
            font: 'Arial',
            size: 24,
            bold: true,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 6000 }, // Espaço maior para empurrar cidade/ano para baixo
      }),
      
      // Cidade e Ano
      new Paragraph({
        children: [
          new TextRun({
            text: info.city,
            font: 'Arial',
            size: 24,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: info.year,
            font: 'Arial',
            size: 24,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ];
  }

  private createTitlePage(): Paragraph[] {
    const { info } = this.document;
    
    // Construir texto dos orientadores
    const advisorsText = info.advisors.length > 0 
      ? info.advisors.map(advisor => `${advisor.title} ${advisor.name}`).join(' e ')
      : '';

    // Construir texto da natureza do trabalho
    const workNatureText = `${info.workNature} apresentado ao ${info.institution} para ${info.workObjective} sob orientação de ${advisorsText}.`;

    return [
      // Instituição
      new Paragraph({
        children: [
          new TextRun({
            text: info.institution.toUpperCase(),
            font: 'Arial',
            size: 24,
            bold: false,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 2500 }, // Espaço maior após instituição
      }),

      // Nome do Autor
      new Paragraph({
        children: [
          new TextRun({
            text: info.author.toUpperCase(),
            font: 'Arial',
            size: 24,
            bold: false,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 3500 },
      }),
      
      // Título e Subtítulo
      new Paragraph({
        children: [
          new TextRun({
            text: info.title.toUpperCase() + (info.subtitle ? `: ${info.subtitle.toUpperCase()}` : ''),
            font: 'Arial',
            size: 24,
            bold: true,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 1800 },
      }),
      
      // Natureza do Trabalho (com recuo especial)
      new Paragraph({
        children: [
          new TextRun({
            text: workNatureText,
            font: 'Arial',
            size: 20,
            color: '000000',
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        indent: { left: 4536 }, // Aproximadamente 8cm em twips (8cm * 567 twips/cm)
        spacing: { line: 240, lineRule: 'auto', after: 1800 }, // Espaçamento simples
      }),
      
      // Cidade
      new Paragraph({
        children: [
          new TextRun({
            text: info.city,
            font: 'Arial',
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 120 },
      }),
      
      // Ano
      new Paragraph({
        children: [
          new TextRun({
            text: info.year,
            font: 'Arial',
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ];
  }

  private createBlockParagraph(block: Block): Paragraph[] {
    switch (block.type) {
      case 'title':
        return [
          new Paragraph({
            children: [
              new TextRun({
                text: block.content,
                font: 'Arial',
                size: 24,
                bold: true,
                color: '000000',
                allCaps: true
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 },
          }),
        ];

      case 'subtitle':
        return [
          new Paragraph({
            children: [
              new TextRun({
                text: block.content,
                font: 'Arial',
                size: 24,
                bold: true,
                color: '000000',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 360, after: 180 },
          }),
        ];

      case 'paragraph':
        return [
          new Paragraph({
            children: [
              new TextRun({
                text: block.content,
                font: 'Arial',
                size: 24,
                color: '000000',
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 708 }, // 1.25cm em twips
            spacing: { line: 360, lineRule: 'auto', after: 240 }, // 1.5 espaçamento
          }),
        ];

      case 'citation':
        return [
          new Paragraph({
            children: [
              new TextRun({
                text: block.content,
                font: 'Arial',
                size: 20, // 10pt
                italics: true,
                color: '000000',
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 2268 }, // 4cm em twips
            spacing: { line: 240, lineRule: 'auto', after: 240 }, // Espaçamento simples
          }),
        ];

      case 'page-break':
        return [
          new Paragraph({
            children: [new TextRun({ text: '', break: 1 })],
            pageBreakBefore: true,
          }),
        ];

      case 'free-form':
        return [
          new Paragraph({
            children: [
              new TextRun({
                text: block.content,
                font: 'Arial',
                size: 24,
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, lineRule: 'auto', after: 240 },
          }),
        ];

      case 'references':
        const references = block.content.split('\n').filter(ref => ref.trim());
        return references.map(ref => 
          new Paragraph({
            children: [
              new TextRun({
                text: ref,
                font: 'Arial',
                size: 24,
                color: '000000',
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 240, lineRule: 'auto', after: 120 }, // Espaçamento simples
            indent: { hanging: 708 }, // Recuo pendente de 1.25cm
          })
        );

      default:
        return [];
    }
  }

  async generateAndDownload(): Promise<void> {
    try {
      // Validar se há orientadores
      if (!this.document.info.advisors || this.document.info.advisors.length === 0) {
        throw new Error('É necessário adicionar pelo menos um orientador.');
      }

      const coverPageParagraphs = this.createCoverPage();
      const titlePageParagraphs = this.createTitlePage();
      
      // Quebras de página
      const pageBreakAfterCover = new Paragraph({
        children: [new TextRun({ text: '', break: 1 })],
        pageBreakBefore: true,
      });

      const pageBreakAfterTitle = new Paragraph({
        children: [new TextRun({ text: '', break: 1 })],
        pageBreakBefore: true,
      });

      // Conteúdo dos blocos
      const sortedBlocks = [...this.document.blocks].sort((a, b) => a.order - b.order);
      const contentParagraphs = sortedBlocks
        .flatMap(block => this.createBlockParagraph(block));

      const doc = new DocxDocument({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1701,    // 3cm
                  right: 1134,  // 2cm
                  bottom: 1134, // 2cm
                  left: 1701,   // 3cm
                },
              },
            },
            children: [
              ...coverPageParagraphs,
              pageBreakAfterCover,
              ...titlePageParagraphs,
              pageBreakAfterTitle,
              ...contentParagraphs,
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const fileName = `${this.document.info.title || 'documento'}.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      throw new Error('Falha ao gerar o documento DOCX');
    }
  }
}