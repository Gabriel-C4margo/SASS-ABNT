'use client';

import { useState } from 'react';
import { Trash2, GripVertical, Image, Table } from 'lucide-react';

interface FreeFormBlockProps {
  id: string;
  content: string;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export default function FreeFormBlock({ id, content, onUpdate, onDelete }: FreeFormBlockProps) {
  const [isEditing, setIsEditing] = useState(!content);

  return (
    <div className="group relative bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-blue-500/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 text-dark-muted">
          <GripVertical className="w-4 h-4" />
          <span className="text-xs font-medium">FORMA LIVRE</span>
        </div>
        
        <div className="flex-1">
          <div className="space-y-3">
            <div className="flex gap-2 mb-3">
              <button className="flex items-center gap-2 px-3 py-1 bg-dark-border hover:bg-dark-border/80 text-dark-text rounded text-sm transition-colors">
                <Image className="w-4 h-4" />
                Imagem
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-dark-border hover:bg-dark-border/80 text-dark-text rounded text-sm transition-colors">
                <Table className="w-4 h-4" />
                Tabela
              </button>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => onUpdate(id, e.target.value)}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
              className="w-full bg-transparent text-dark-text border-none outline-none placeholder-dark-muted resize-none min-h-[120px]"
              placeholder="Área flexível para conteúdo personalizado, imagens ou tabelas..."
              style={{ lineHeight: '1.6' }}
            />
          </div>
        </div>

        <button
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all"
          title="Excluir bloco"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}