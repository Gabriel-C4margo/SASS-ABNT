export interface DocumentInfo {
  institution: string;
  course: string;
  author: string;
  title: string;
  subtitle?: string;
  city: string;
  year: string;
  workNature: string;
  workObjective: string;
  advisors: Advisor[];
}

export interface Advisor {
  id: string;
  name: string;
  title: string; // Dr., Dra., Me., Prof., etc.
}

export type BlockType = 
  | 'title' 
  | 'subtitle' 
  | 'paragraph' 
  | 'citation' 
  | 'page-break' 
  | 'free-form' 
  | 'references'
  | 'summary';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  order: number;
  level?: 1 | 2 | 3 | 4 | 5; // Para títulos hierárquicos
  numbering?: string; // Numeração automática (1, 1.1, 1.1.1, etc.)
  pageNumber?: number; // Para o sumário
}

export interface SummaryEntry {
  id: string;
  title: string;
  numbering: string;
  level: number;
  pageNumber: number;
}

export interface Document {
  info: DocumentInfo;
  blocks: Block[];
  summary?: SummaryEntry[];
}