'use client';

import { Plus, Download, Settings, FileText } from 'lucide-react';
import { BlockType } from '@/types/document';

interface ToolbarProps {
  onAddBlock: (type: BlockType) => void;
  onExport: () => void;
  onOpenSettings: () => void;
}

const blockTypes: { type: BlockType; label: string; icon: string }[] = [
  { type: 'title', label: 'Título Nível 1', icon: '1️⃣' },
  { type: 'subtitle', label: 'Título Nível 2', icon: '2️⃣' },
  { type: 'paragraph', label: 'Parágrafo', icon: '📃' },
  { type: 'citation', label: 'Citação', icon: '💬' },
  { type: 'summary', label: 'Sumário', icon: '📋' },
  { type: 'page-break', label: 'Quebra de Página', icon: '📋' },
  { type: 'free-form', label: 'Forma Livre', icon: '🎨' },
  { type: 'references', label: 'Referências', icon: '📚' },
];

const titleLevels = [
  { level: 1, label: 'Nível 1', icon: '1️⃣' },
  { level: 2, label: 'Nível 2', icon: '2️⃣' },
  { level: 3, label: 'Nível 3', icon: '3️⃣' },
  { level: 4, label: 'Nível 4', icon: '4️⃣' },
  { level: 5, label: 'Nível 5', icon: '5️⃣' },
];

export default function Toolbar({ onAddBlock, onExport, onOpenSettings }: ToolbarProps) {
  const [showTitleLevels, setShowTitleLevels] = useState(false);

  const handleAddTitle = (level: 1 | 2 | 3 | 4 | 5) => {
    onAddBlock('title', level);
    setShowTitleLevels(false);
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl px-4">
      <div className="bg-dark-surface/95 backdrop-blur-sm border border-dark-border rounded-lg shadow-xl p-3">
        <div className="flex items-center gap-2">
          {/* Add Block Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:shadow-lg">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Campo</span>
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-52 bg-dark-surface/95 backdrop-blur-sm border border-dark-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2">
                {/* Título com submenu */}
                <div className="relative group/title">
                  <button
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-dark-text hover:bg-blue-600/20 hover:text-blue-300 rounded-lg transition-all"
                    onMouseEnter={() => setShowTitleLevels(true)}
                    onMouseLeave={() => setShowTitleLevels(false)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">1️⃣</span>
                      <span className="text-sm font-medium">Título</span>
                    </div>
                    <span className="text-xs">▶</span>
                  </button>
                  
                  {showTitleLevels && (
                {blockTypes.map((block) => (
                  <button
                    key={block.type}
                    onClick={() => onAddBlock(block.type)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-dark-text hover:bg-blue-600/20 hover:text-blue-300 rounded-lg transition-all"
                  >
                    <span className="text-lg">{block.icon}</span>
                    <span className="text-sm font-medium">{block.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-px h-7 bg-dark-border/50"></div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2.5 text-dark-text hover:bg-dark-border hover:text-blue-300 rounded-lg transition-all"
            title="Configurações do Documento"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Config</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Gerar .docx</span>
          </button>
        </div>
      </div>
    </div>
  );
}