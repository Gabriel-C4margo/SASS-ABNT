'use client';

import { Trash2, GripVertical, FileText } from 'lucide-react';

interface PageBreakBlockProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function PageBreakBlock({ id, onDelete }: PageBreakBlockProps) {
  return (
    <div className="group relative bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-blue-500/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-dark-muted">
          <GripVertical className="w-4 h-4" />
          <span className="text-xs font-medium">QUEBRA DE PÁGINA</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="flex items-center gap-3 text-dark-muted">
            <div className="w-16 h-px bg-dark-border"></div>
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Nova Página</span>
            <FileText className="w-5 h-5" />
            <div className="w-16 h-px bg-dark-border"></div>
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