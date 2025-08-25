'use client';

import { useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

interface CitationBlockProps {
  id: string;
  content: string;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export default function CitationBlock({ id, content, onUpdate, onDelete }: CitationBlockProps) {
  const [isEditing, setIsEditing] = useState(!content);

  return (
    <div className="group relative bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-blue-500/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 text-dark-muted">
          <GripVertical className="w-4 h-4" />
          <span className="text-xs font-medium">CITAÇÃO</span>
        </div>
        
        <div className="flex-1">
          <div className="border-l-4 border-blue-500 pl-4">
            <textarea
              value={content}
              onChange={(e) => onUpdate(id, e.target.value)}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
              className="w-full bg-transparent text-dark-text border-none outline-none placeholder-dark-muted resize-none min-h-[80px] text-sm italic"
              placeholder="Digite a citação (mais de 3 linhas)..."
              style={{ lineHeight: '1.4' }}
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