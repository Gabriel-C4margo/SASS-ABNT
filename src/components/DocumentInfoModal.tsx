'use client';

import { useState } from 'react';
import { DocumentInfo, Advisor } from '@/types/document';
import { X, Plus, Trash2 } from 'lucide-react';

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
      workNature: '',
      workObjective: '',
      advisors: [],
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

  const addAdvisor = () => {
    const newAdvisor: Advisor = {
      id: `advisor-${Date.now()}`,
      name: '',
      title: 'Prof.',
    };
    setFormData(prev => ({
      ...prev,
      advisors: [...prev.advisors, newAdvisor],
    }));
  };

  const updateAdvisor = (id: string, field: keyof Advisor, value: string) => {
    setFormData(prev => ({
      ...prev,
      advisors: prev.advisors.map(advisor =>
        advisor.id === id ? { ...advisor, [field]: value } : advisor
      ),
    }));
  };

  const removeAdvisor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      advisors: prev.advisors.filter(advisor => advisor.id !== id),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface border border-dark-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <h2 className="text-xl font-semibold text-dark-text">
            Informações do Documento - Capa e Folha de Rosto
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
                placeholder="Ex: CENTRO UNIVERSITÁRIO ENIAC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Nome do Curso
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Fisioterapia"
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
              placeholder="Ex: BEATRIZ FREITAS MORAIS"
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
              placeholder="Ex: IMPACTO DA PREMATURIDADE NO DESENVOLVIMENTO CARDIOVASCULAR NEONATAL"
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
              placeholder="Ex: UMA REVISÃO DE LITERATURA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Natureza do Trabalho *
            </label>
            <input
              type="text"
              required
              value={formData.workNature}
              onChange={(e) => handleChange('workNature', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Trabalho de Conclusão de Curso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Objetivo do Trabalho *
            </label>
            <input
              type="text"
              required
              value={formData.workObjective}
              onChange={(e) => handleChange('workObjective', e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: obtenção do título de bacharel em Fisioterapia"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-dark-text">
                Orientadores *
              </label>
              <button
                type="button"
                onClick={addAdvisor}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            
            {formData.advisors.length === 0 && (
              <div className="text-center py-4 text-dark-muted">
                <p className="text-sm">Nenhum orientador adicionado</p>
                <p className="text-xs mt-1">Clique em "Adicionar" para incluir um orientador</p>
              </div>
            )}
            
            <div className="space-y-3">
              {formData.advisors.map((advisor, index) => (
                <div key={advisor.id} className="flex gap-3 items-start p-3 bg-dark-bg border border-dark-border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-dark-muted mb-1">
                        Título
                      </label>
                      <select
                        value={advisor.title}
                        onChange={(e) => updateAdvisor(advisor.id, 'title', e.target.value)}
                        className="w-full px-2 py-1 bg-dark-surface border border-dark-border rounded text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Prof.">Prof.</option>
                        <option value="Profa.">Profa.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Dra.">Dra.</option>
                        <option value="Me.">Me.</option>
                        <option value="Ma.">Ma.</option>
                        <option value="Esp.">Esp.</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-dark-muted mb-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={advisor.name}
                        onChange={(e) => updateAdvisor(advisor.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 bg-dark-surface border border-dark-border rounded text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Karina Cassaro"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAdvisor(advisor.id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors mt-5"
                    title="Remover orientador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {formData.advisors.length > 0 && (
              <p className="text-xs text-dark-muted mt-2">
                * Pelo menos um orientador é obrigatório
              </p>
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
                placeholder="Ex: Guarulhos"
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
                placeholder="Ex: 2025"
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
              disabled={formData.advisors.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}