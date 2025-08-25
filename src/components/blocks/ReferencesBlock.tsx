'use client';

import { useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

interface ReferencesBlockProps {
  id: string;
  content: string;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export default function ReferencesBlock({ id, content, onUpdate, onDelete }: ReferencesBlockProps) {
  const [isEditing, setIsEditing] = useState(!content);

  return (
    <div className="group relative bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-blue-500/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 text-dark-muted">
          <GripVertical className="w-4 h-4" />
          <span className="text-xs font-medium">REFERÊNCIAS</span>
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => onUpdate(id, e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            className="w-full bg-transparent text-dark-text border-none outline-none placeholder-dark-muted resize-none min-h-[150px] font-mono text-sm"
            placeholder="Digite as referências bibliográficas no formato ABNT:

SOBRENOME, Nome. Título da obra. Cidade: Editora, ano.

AUTOR, A. A. Título do artigo. Nome da Revista, v. 1, n. 1, p. 1-10, 2024."
            style={{ lineHeight: '1.5' }}
          />
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