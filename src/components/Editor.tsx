'use client';

import { useState, useEffect } from 'react';
import { Block, BlockType, Document, DocumentInfo } from '@/types/document';
import { DocxGenerator } from '@/lib/docx-generator';
import Toolbar from './Toolbar';
import DocumentInfoModal from './DocumentInfoModal';
import TitleBlock from './blocks/TitleBlock';
import SubtitleBlock from './blocks/SubtitleBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CitationBlock from './blocks/CitationBlock';
import PageBreakBlock from './blocks/PageBreakBlock';
import FreeFormBlock from './blocks/FreeFormBlock';
import ReferencesBlock from './blocks/ReferencesBlock';

export default function Editor() {
  const [document, setDocument] = useState<Document>({
    info: {
      institution: '',
      course: '',
      author: '',
      title: '',
      subtitle: '',
      city: '',
      year: new Date().getFullYear().toString(),
    },
    blocks: [],
  });

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [nextOrder, setNextOrder] = useState(1);

  // Mostrar modal de informações na primeira vez
  useEffect(() => {
    const hasInfo = document.info.institution || document.info.author || document.info.title;
    if (!hasInfo) {
      setShowInfoModal(true);
    }
  }, []);

  const handleAddBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: '',
      order: nextOrder,
    };

    setDocument(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setNextOrder(prev => prev + 1);
  };

  const handleUpdateBlock = (id: string, content: string) => {
    setDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === id ? { ...block, content } : block
      ),
    }));
  };

  const handleDeleteBlock = (id: string) => {
    setDocument(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id),
    }));
  };

  const handleUpdateDocumentInfo = (info: DocumentInfo) => {
    setDocument(prev => ({ ...prev, info }));
  };

  const handleExport = async () => {
    try {
      const generator = new DocxGenerator(document);
      await generator.generateAndDownload();
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao gerar o documento. Tente novamente.');
    }
  };

  const renderBlock = (block: Block) => {
    const commonProps = {
      id: block.id,
      content: block.content,
      onUpdate: handleUpdateBlock,
      onDelete: handleDeleteBlock,
    };

    switch (block.type) {
      case 'title':
        return <TitleBlock key={block.id} {...commonProps} />;
      case 'subtitle':
        return <SubtitleBlock key={block.id} {...commonProps} />;
      case 'paragraph':
        return <ParagraphBlock key={block.id} {...commonProps} />;
      case 'citation':
        return <CitationBlock key={block.id} {...commonProps} />;
      case 'page-break':
        return <PageBreakBlock key={block.id} id={block.id} onDelete={handleDeleteBlock} />;
      case 'free-form':
        return <FreeFormBlock key={block.id} {...commonProps} />;
      case 'references':
        return <ReferencesBlock key={block.id} {...commonProps} />;
      default:
        return null;
    }
  };

  const sortedBlocks = [...document.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Toolbar
        onAddBlock={handleAddBlock}
        onExport={handleExport}
        onOpenSettings={() => setShowInfoModal(true)}
      />

      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-dark-text mb-2">
              FormataFácil
            </h1>
            <p className="text-dark-muted">
              Editor de documentos acadêmicos com formatação ABNT automática
            </p>
          </div>

          {sortedBlocks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-semibold text-dark-text mb-2">
                Comece seu documento
              </h2>
              <p className="text-dark-muted mb-6">
                Use a barra de ferramentas acima para adicionar seu primeiro campo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedBlocks.map(renderBlock)}
            </div>
          )}
        </div>
      </div>

      <DocumentInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onSave={handleUpdateDocumentInfo}
        initialData={document.info}
      />
    </div>
  );
}