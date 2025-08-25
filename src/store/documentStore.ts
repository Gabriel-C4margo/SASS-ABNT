import { create } from 'zustand';
import { Block, BlockType, Document, DocumentInfo } from '@/types/document';

interface DocumentStore {
  document: Document;
  nextOrder: number;
  
  // Actions
  setDocumentInfo: (info: DocumentInfo) => void;
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, content: string) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (blocks: Block[]) => void;
  duplicateBlock: (id: string) => void;
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

  addBlock: (type) => {
    const { nextOrder } = get();
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: '',
      order: nextOrder,
    };

    set((state) => ({
      document: {
        ...state.document,
        blocks: [...state.document.blocks, newBlock],
      },
      nextOrder: nextOrder + 1,
    }));
  },

  updateBlock: (id, content) =>
    set((state) => ({
      document: {
        ...state.document,
        blocks: state.document.blocks.map((block) =>
          block.id === id ? { ...block, content } : block
        ),
      },
    })),

  deleteBlock: (id) =>
    set((state) => ({
      document: {
        ...state.document,
        blocks: state.document.blocks.filter((block) => block.id !== id),
      },
    })),

  reorderBlocks: (blocks) =>
    set((state) => ({
      document: {
        ...state.document,
        blocks: blocks.map((block, index) => ({
          ...block,
          order: index + 1,
        })),
      },
    })),

  duplicateBlock: (id) => {
    const { document, nextOrder } = get();
    const blockToDuplicate = document.blocks.find((block) => block.id === id);
    
    if (blockToDuplicate) {
      const duplicatedBlock: Block = {
        ...blockToDuplicate,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: nextOrder,
      };

      set((state) => ({
        document: {
          ...state.document,
          blocks: [...state.document.blocks, duplicatedBlock],
        },
        nextOrder: nextOrder + 1,
      }));
    }
  },
}));