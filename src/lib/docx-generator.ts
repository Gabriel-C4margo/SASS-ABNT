import { Document as DocxDocument, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Document, Block } from '@/types/document';

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
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      
      // Curso
      new Paragraph({
        children: [
          new TextRun({
            text: info.course.toUpperCase(),
            font: 'Arial',
            size: 24,
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
      }),
      
      // Autor
      new Paragraph({
        children: [
          new TextRun({
            text: info.author.toUpperCase(),
            font: 'Arial',
            size: 24,
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 1200 },
      }),
      
      // Título
      new Paragraph({
        children: [
          new TextRun({
            text: info.title.toUpperCase(),
            font: 'Arial',
            size: 24,
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: info.subtitle ? 200 : 1200 },
      }),
      
      // Subtítulo (se houver)
      ...(info.subtitle ? [
        new Paragraph({
          children: [
            new TextRun({
              text: info.subtitle,
              font: 'Arial',
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 1200 },
        }),
      ] : []),
      
      // Cidade e Ano
      new Paragraph({
        children: [
          new TextRun({
            text: `${info.city}\n${info.year}`,
            font: 'Arial',
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000 },
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
      const coverPageParagraphs = this.createCoverPage();
      
      // Quebra de página após a capa
      const pageBreak = new Paragraph({
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
              pageBreak,
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