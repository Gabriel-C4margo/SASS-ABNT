import React, { useState } from 'react';
import { DocumentInfo, Advisor } from '@/types/document';

interface DocumentInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (info: DocumentInfo) => void;
	initialData: DocumentInfo;
}

export default function DocumentInfoModal({ isOpen, onClose, onSave, initialData }: DocumentInfoModalProps) {
	const [info, setInfo] = useState<DocumentInfo>(initialData);
	const [advisorName, setAdvisorName] = useState('');
	const [advisorTitle, setAdvisorTitle] = useState('');

	if (!isOpen) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setInfo(prev => ({ ...prev, [name]: value }));
	};

	const handleAddAdvisor = () => {
		if (advisorName && advisorTitle) {
			setInfo(prev => ({
				...prev,
				advisors: [
					...prev.advisors,
					{ id: `${Date.now()}`, name: advisorName, title: advisorTitle },
				],
			}));
			setAdvisorName('');
			setAdvisorTitle('');
		}
	};

	const handleRemoveAdvisor = (id: string) => {
		setInfo(prev => ({
			...prev,
			advisors: prev.advisors.filter(a => a.id !== id),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(info);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white dark:bg-dark-bg rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-bold mb-4 text-dark-text">Informações do Documento</h2>
				<form onSubmit={handleSubmit} className="space-y-3">
					<input name="institution" value={info.institution} onChange={handleChange} placeholder="Instituição" className="w-full px-3 py-2 rounded border" />
					<input name="course" value={info.course} onChange={handleChange} placeholder="Curso" className="w-full px-3 py-2 rounded border" />
					<input name="author" value={info.author} onChange={handleChange} placeholder="Autor" className="w-full px-3 py-2 rounded border" />
					<input name="title" value={info.title} onChange={handleChange} placeholder="Título" className="w-full px-3 py-2 rounded border" />
					<input name="subtitle" value={info.subtitle || ''} onChange={handleChange} placeholder="Subtítulo (opcional)" className="w-full px-3 py-2 rounded border" />
					<input name="city" value={info.city} onChange={handleChange} placeholder="Cidade" className="w-full px-3 py-2 rounded border" />
					<input name="year" value={info.year} onChange={handleChange} placeholder="Ano" className="w-full px-3 py-2 rounded border" />
					<input name="workNature" value={info.workNature} onChange={handleChange} placeholder="Natureza do Trabalho" className="w-full px-3 py-2 rounded border" />
					<input name="workObjective" value={info.workObjective} onChange={handleChange} placeholder="Objetivo do Trabalho" className="w-full px-3 py-2 rounded border" />

					<div>
						<label className="block font-medium mb-1">Orientadores</label>
						<div className="flex gap-2 mb-2">
							<input value={advisorTitle} onChange={e => setAdvisorTitle(e.target.value)} placeholder="Título (Ex: Prof., Dr.)" className="px-2 py-1 rounded border w-1/3" />
							<input value={advisorName} onChange={e => setAdvisorName(e.target.value)} placeholder="Nome" className="px-2 py-1 rounded border w-2/3" />
							<button type="button" onClick={handleAddAdvisor} className="bg-blue-600 text-white px-3 py-1 rounded">Adicionar</button>
						</div>
						<ul className="space-y-1">
							{info.advisors.map(a => (
								<li key={a.id} className="flex justify-between items-center bg-gray-100 dark:bg-dark-border px-2 py-1 rounded">
									<span>{a.title} {a.name}</span>
									<button type="button" onClick={() => handleRemoveAdvisor(a.id)} className="text-red-500">Remover</button>
								</li>
							))}
						</ul>
					</div>

					<div className="flex justify-end gap-2 mt-4">
						<button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-dark-border text-dark-text">Cancelar</button>
						<button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Salvar</button>
					</div>
				</form>
			</div>
		</div>
	);
}