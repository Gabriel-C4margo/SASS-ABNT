'use client';

import { useState, useEffect } from 'react';
import { BlockType } from '@/types/document';
import { DocxGenerator } from '@/lib/docx-generator';
import { useDocumentStore } from '@/store/documentStore';
import Toolbar from './Toolbar';
import DocumentInfoModal from './DocumentInfoModal';
import DraggableBlockList from './DraggableBlockList';

export default function Editor() {
  const { document, addBlock, setDocumentInfo } = useDocumentStore();
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Mostrar modal de informações na primeira vez
  useEffect(() => {
    const hasInfo = document.info.institution || document.info.author || document.info.title || document.info.advisors.length > 0;
    if (!hasInfo) {
      setShowInfoModal(true);
    }
  }, []);

  const handleExport = async () => {
    try {
      const generator = new DocxGenerator(document);
      await generator.generateAndDownload();
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao gerar o documento. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Toolbar
        onAddBlock={addBlock}
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

          {document.blocks.length === 0 ? (
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
            <DraggableBlockList />
          )}
        </div>
      </div>

      <DocumentInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onSave={setDocumentInfo}
        initialData={document.info}
      />
    </div>
  );
}