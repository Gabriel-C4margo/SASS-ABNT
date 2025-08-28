import { create } from 'zustand';
import { Block, BlockType, Document, DocumentInfo } from '@/types/document';

// Função para gerar numeração hierárquica automática
function generateNumbering(blocks: Block[]): Block[] {
  const counters = [0, 0, 0, 0, 0]; // Contadores para cada nível (1-5)
  
  return blocks.map(block => {
    if ((block.type === 'title' || block.type === 'subtitle') && block.level) {
      const level = block.level;
      
      // Incrementa contador do nível atual
      counters[level - 1]++;
      
      // Zera contadores dos níveis inferiores
      for (let i = level; i < counters.length; i++) {
        counters[i] = 0;
      }
      
      // Gera numeração baseada nos contadores ativos
      const numbering = counters
        .slice(0, level)
        .filter(count => count > 0)
        .join('.');
      
      return { ...block, numbering };
    }
    return block;
  });
}

// Função para gerar sumário dinâmico
function generateSummary(blocks: Block[]) {
  let currentPage = 3; // Começa na página 3 (após capa e folha de rosto)
  
  return blocks
    .filter(block => (block.type === 'title' || block.type === 'subtitle') && block.level)
    .map(block => {
      // Simula incremento de página baseado no tipo de bloco
      if (block.type === 'page-break') {
        currentPage++;
      }
      
      return {
        id: block.id,
        title: block.content,
        numbering: block.numbering || '',
        level: block.level || 1,
        pageNumber: currentPage
      };
    });
}

interface DocumentStore {
  document: Document;
  nextOrder: number;
  
  // Actions
  setDocumentInfo: (info: DocumentInfo) => void;
  addBlock: (type: BlockType, level?: 1 | 2 | 3 | 4 | 5) => void;
  updateBlock: (id: string, content: string) => void;
  updateBlockLevel: (id: string, level: 1 | 2 | 3 | 4 | 5) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (blocks: Block[]) => void;
  duplicateBlock: (id: string) => void;
  updateNumbering: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  document: {
    info: {
      institution: '',
      course: '',
      author: '',
      title: '',
      subtitle: '',
      city: '',
      year: new Date().getFullYear().toString(),
      workNature: '',
      workObjective: '',
      advisors: [],
    },
    blocks: [],
  },
  nextOrder: 1,

  setDocumentInfo: (info) =>
    set((state) => ({
      document: { ...state.document, info },
    })),

  addBlock: (type, level) => {
    const { nextOrder } = get();
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: '',
      order: nextOrder,
      ...(type === 'title' || type === 'subtitle' ? { level: level || 1 } : {}),
    };

    set((state) => {
      const updatedBlocks = [...state.document.blocks, newBlock];
      const numberedBlocks = generateNumbering(updatedBlocks);
      
      return {
        document: {
          ...state.document,
          blocks: numberedBlocks,
          summary: generateSummary(numberedBlocks),
        },
        nextOrder: nextOrder + 1,
      };
    });
  },

  updateBlock: (id, content) =>
    set((state) => {
      const updatedBlocks = state.document.blocks.map((block) =>
        block.id === id ? { ...block, content } : block
      );
      const numberedBlocks = generateNumbering(updatedBlocks);
      
      return {
        document: {
          ...state.document,
          blocks: numberedBlocks,
          summary: generateSummary(numberedBlocks),
        },
      };
    }),

  updateBlockLevel: (id, level) =>
    set((state) => {
      const updatedBlocks = state.document.blocks.map((block) =>
        block.id === id ? { ...block, level } : block
      );
      const numberedBlocks = generateNumbering(updatedBlocks);
      
      return {
        document: {
          ...state.document,
          blocks: numberedBlocks,
          summary: generateSummary(numberedBlocks),
        },
      };
    }),
  deleteBlock: (id) =>
    set((state) => {
      const updatedBlocks = state.document.blocks.filter((block) => block.id !== id);
      const numberedBlocks = generateNumbering(updatedBlocks);
      
      return {
        document: {
          ...state.document,
          blocks: numberedBlocks,
          summary: generateSummary(numberedBlocks),
        },
      };
    }),

  reorderBlocks: (blocks) =>
    set((state) => {
      const reorderedBlocks = blocks.map((block, index) => ({
        ...block,
        order: index + 1,
      }));
      const numberedBlocks = generateNumbering(reorderedBlocks);
      
      return {
        document: {
          ...state.document,
          blocks: numberedBlocks,
          summary: generateSummary(numberedBlocks),
        },
      };
    }),

  duplicateBlock: (id) => {
    const { document, nextOrder } = get();
    const blockToDuplicate = document.blocks.find((block) => block.id === id);
    
    if (blockToDuplicate) {
      const duplicatedBlock: Block = {
        ...blockToDuplicate,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: nextOrder,
      };

      set((state) => {
        const updatedBlocks = [...state.document.blocks, duplicatedBlock];
        const numberedBlocks = generateNumbering(updatedBlocks);
        
        return {
          document: {
            ...state.document,
            blocks: numberedBlocks,
            summary: generateSummary(numberedBlocks),
          },
          nextOrder: nextOrder + 1,
        };
      });
    }
  },

  updateNumbering: () =>
    set((state) => {
      const numberedBlocks = generateNumbering(state.document.blocks);
      
      return {
        document: {
          ...state.document,
          blocks: numberedBlocks,
          summary: generateSummary(numberedBlocks),
        },
      };
    }),
}));