'use client';

import { Plus, FileText, Download, Settings } from 'lucide-react';
import { BlockType } from '@/types/document';

interface ToolbarProps {
  onAddBlock: (type: BlockType) => void;
  onExport: () => void;
  onOpenSettings: () => void;
}

const blockTypes: { type: BlockType; label: string; icon: string }[] = [
  { type: 'title', label: 'Título', icon: '📝' },
  { type: 'subtitle', label: 'Subtítulo', icon: '📄' },
  { type: 'paragraph', label: 'Parágrafo', icon: '📃' },
  { type: 'citation', label: 'Citação', icon: '💬' },
  { type: 'page-break', label: 'Quebra de Página', icon: '📄' },
  { type: 'free-form', label: 'Forma Livre', icon: '🎨' },
  { type: 'references', label: 'Referências', icon: '📚' },
];

export default function Toolbar({ onAddBlock, onExport, onOpenSettings }: ToolbarProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-dark-surface border border-dark-border rounded-lg shadow-lg p-2">
        <div className="flex items-center gap-2">
          {/* Add Block Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Campo</span>
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2">
                {blockTypes.map((block) => (
                  <button
                    key={block.type}
                    onClick={() => onAddBlock(block.type)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-dark-text hover:bg-dark-border rounded-lg transition-colors"
                  >
                    <span className="text-lg">{block.icon}</span>
                    <span className="text-sm">{block.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-px h-6 bg-dark-border"></div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 text-dark-text hover:bg-dark-border rounded-lg transition-colors"
            title="Configurações do Documento"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Config</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Gerar .docx</span>
          </button>
        </div>
      </div>
    </div>
  );
}