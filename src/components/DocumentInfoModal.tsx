'use client';

import { useState } from 'react';
import { DocumentInfo } from '@/types/document';
import { X } from 'lucide-react';

interface DocumentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (info: DocumentInfo) => void;
  initialData?: DocumentInfo;
}

export default function DocumentInfoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}: DocumentInfoModalProps) {
  const [formData, setFormData] = useState<DocumentInfo>(
    initialData || {
      institution: '',
      course: '',
      author: '',
      title: '',
      subtitle: '',
      city: '',
      year: new Date().getFullYear().toString(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof DocumentInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface border border-dark-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <h2 className="text-xl font-semibold text-dark-text">
            Informações do Documento
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Nome da Instituição *
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Universidade Federal de São Paulo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Nome do Curso *
              </label>
              <input
                type="text"
                required
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Engenharia de Software"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Nome do Autor *
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: João Silva Santos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Título do Trabalho *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Análise de Sistemas de Informação"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Subtítulo do Trabalho
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Uma abordagem prática (opcional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Cidade *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: São Paulo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Ano *
              </label>
              <input
                type="text"
                required
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 2024"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-dark-muted hover:text-dark-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}