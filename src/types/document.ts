export interface DocumentInfo {
  institution: string;
  course: string;
  author: string;
  title: string;
  subtitle?: string;
  city: string;
  year: string;
}

export type BlockType = 
  | 'title' 
  | 'subtitle' 
  | 'paragraph' 
  | 'citation' 
  | 'page-break' 
  | 'free-form' 
  | 'references';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  order: number;
}

export interface Document {
  info: DocumentInfo;
  blocks: Block[];
}