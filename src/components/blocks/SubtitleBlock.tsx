'use client';

import { useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

interface SubtitleBlockProps {
  id: string;
  content: string;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export default function SubtitleBlock({ id, content, onUpdate, onDelete }: SubtitleBlockProps) {
  const [isEditing, setIsEditing] = useState(!content);

  const handleSave = (value: string) => {
    onUpdate(id, value);
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-blue-500/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 text-dark-muted">
          <GripVertical className="w-4 h-4" />
          <span className="text-xs font-medium">SUBTÍTULO</span>
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={content}
              onChange={(e) => onUpdate(id, e.target.value)}
              onBlur={(e) => handleSave(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave((e.target as HTMLInputElement).value);
                }
              }}
              className="w-full bg-transparent text-lg font-semibold text-dark-text border-none outline-none placeholder-dark-muted"
              placeholder="Digite o subtítulo..."
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-semibold text-dark-text cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {content || 'Clique para editar o subtítulo'}
            </h3>
          )}
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