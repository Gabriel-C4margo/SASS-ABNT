'use client';

import { useState } from 'react';
import { Trash2, GripVertical, Copy } from 'lucide-react';

interface TitleBlockProps {
  id: string;
  content: string;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
  dragHandleProps?: any;
}

export default function TitleBlock({ 
  id, 
  content, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  dragHandleProps 
}: TitleBlockProps) {
  const [isEditing, setIsEditing] = useState(!content);

  const handleSave = (value: string) => {
    onUpdate(id, value);
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-blue-500/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 text-dark-muted cursor-grab active:cursor-grabbing" {...dragHandleProps}>
          <GripVertical className="w-4 h-4 hover:text-blue-400 transition-colors" />
          <span className="text-xs font-medium">TÍTULO</span>
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
              className="w-full bg-transparent text-xl font-bold text-dark-text border-none outline-none placeholder-dark-muted"
              placeholder="Digite o título da seção..."
              autoFocus
            />
          ) : (
            <h2 
              className="text-xl font-bold text-dark-text cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {content || 'Clique para editar o título'}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(id)}
              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
              title="Duplicar bloco"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(id)}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Excluir bloco"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}