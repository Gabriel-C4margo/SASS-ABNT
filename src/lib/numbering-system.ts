/**
 * Sistema de Numeração Hierárquica ABNT
 * 
 * Este módulo implementa a lógica para:
 * 1. Gerar numeração automática hierárquica (1, 1.1, 1.1.1, etc.)
 * 2. Atualizar numeração dinamicamente quando blocos são modificados
 * 3. Gerar sumário automaticamente baseado nos títulos numerados
 */

import { Block, SummaryEntry } from '@/types/document';

/**
 * Estrutura de dados para controlar contadores hierárquicos
 * Exemplo: [1, 2, 0, 0, 0] representa "1.2"
 */
interface NumberingCounters {
  counters: number[]; // Array de 5 posições para níveis 1-5
  maxLevel: number;   // Nível máximo usado
}

/**
 * Gera numeração hierárquica automática para blocos de título
 * 
 * Algoritmo:
 * 1. Percorre blocos ordenados sequencialmente
 * 2. Para cada título/subtítulo com nível definido:
 *    - Incrementa contador do nível atual
 *    - Zera contadores dos níveis inferiores
 *    - Gera string de numeração baseada nos contadores ativos
 * 
 * @param blocks Array de blocos do documento
 * @returns Array de blocos com numeração atualizada
 */
export function generateHierarchicalNumbering(blocks: Block[]): Block[] {
  const counters: NumberingCounters = {
    counters: [0, 0, 0, 0, 0], // Níveis 1-5
    maxLevel: 0
  };

  return blocks.map(block => {
    // Processa apenas títulos e subtítulos com nível definido
    if ((block.type === 'title' || block.type === 'subtitle') && 
        block.level && 
        block.isNumbered !== false) {
      
      const level = block.level;
      counters.maxLevel = Math.max(counters.maxLevel, level);
      
      // Incrementa contador do nível atual
      counters.counters[level - 1]++;
      
      // Zera contadores dos níveis inferiores
      for (let i = level; i < counters.counters.length; i++) {
        counters.counters[i] = 0;
      }
      
      // Gera string de numeração
      const numbering = generateNumberingString(counters.counters, level);
      
      return { ...block, numbering };
    }
    
    return block;
  });
}

/**
 * Gera string de numeração baseada nos contadores ativos
 * 
 * @param counters Array de contadores
 * @param level Nível atual
 * @returns String de numeração (ex: "1.2.3")
 */
function generateNumberingString(counters: number[], level: number): string {
  return counters
    .slice(0, level)
    .filter(count => count > 0)
    .join('.');
}

/**
 * Simula cálculo de páginas baseado no tipo e tamanho do conteúdo
 * 
 * Estimativas:
 * - Título: 0.2 páginas
 * - Parágrafo: baseado no número de caracteres
 * - Citação: baseado no número de caracteres (menor densidade)
 * - Quebra de página: força nova página
 * 
 * @param blocks Array de blocos ordenados
 * @returns Mapa de ID do bloco para número da página
 */
export function calculatePageNumbers(blocks: Block[]): Map<string, number> {
  const pageMap = new Map<string, number>();
  let currentPage = 3; // Começa na página 3 (após capa e folha de rosto)
  let currentPageContent = 0; // Conteúdo acumulado na página atual
  
  const CHARS_PER_PAGE = 2500; // Estimativa de caracteres por página
  
  blocks.forEach(block => {
    // Quebra de página força nova página
    if (block.type === 'page-break') {
      currentPage++;
      currentPageContent = 0;
      pageMap.set(block.id, currentPage);
      return;
    }
    
    // Calcula "peso" do bloco em caracteres
    let blockWeight = 0;
    switch (block.type) {
      case 'title':
      case 'subtitle':
        blockWeight = 200; // Títulos ocupam pouco espaço
        break;
      case 'paragraph':
        blockWeight = block.content.length;
        break;
      case 'citation':
        blockWeight = block.content.length * 0.8; // Citações têm fonte menor
        break;
      case 'free-form':
        blockWeight = block.content.length;
        break;
      case 'references':
        blockWeight = block.content.length * 0.9; // Referências têm fonte menor
        break;
    }
    
    // Verifica se precisa quebrar página
    if (currentPageContent + blockWeight > CHARS_PER_PAGE && currentPageContent > 0) {
      currentPage++;
      currentPageContent = blockWeight;
    } else {
      currentPageContent += blockWeight;
    }
    
    pageMap.set(block.id, currentPage);
  });
  
  return pageMap;
}

/**
 * Gera entradas do sumário baseado nos títulos numerados
 * 
 * @param blocks Array de blocos do documento
 * @returns Array de entradas do sumário
 */
export function generateTableOfContents(blocks: Block[]): SummaryEntry[] {
  const pageNumbers = calculatePageNumbers(blocks);
  
  return blocks
    .filter(block => 
      (block.type === 'title' || block.type === 'subtitle') && 
      block.level && 
      block.numbering && 
      block.content.trim() &&
      block.isNumbered !== false
    )
    .map(block => ({
      id: block.id,
      title: block.content,
      numbering: block.numbering!,
      level: block.level!,
      pageNumber: pageNumbers.get(block.id) || 1
    }));
}

/**
 * Atualiza numeração e sumário de forma reativa
 * Deve ser chamada sempre que blocos são adicionados, removidos ou reordenados
 * 
 * @param blocks Array atual de blocos
 * @returns Objeto com blocos atualizados e sumário
 */
export function updateDocumentStructure(blocks: Block[]) {
  // 1. Ordena blocos por ordem
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  
  // 2. Gera numeração hierárquica
  const numberedBlocks = generateHierarchicalNumbering(sortedBlocks);
  
  // 3. Gera sumário
  const tableOfContents = generateTableOfContents(numberedBlocks);
  
  return {
    blocks: numberedBlocks,
    tableOfContents
  };
}

/**
 * Valida se a estrutura hierárquica está correta
 * Verifica se não há "saltos" de nível (ex: nível 1 direto para nível 3)
 * 
 * @param blocks Array de blocos
 * @returns Array de avisos sobre problemas na estrutura
 */
export function validateHierarchy(blocks: Block[]): string[] {
  const warnings: string[] = [];
  let lastLevel = 0;
  
  blocks
    .filter(block => (block.type === 'title' || block.type === 'subtitle') && block.level)
    .forEach((block, index) => {
      const currentLevel = block.level!;
      
      // Verifica salto de nível
      if (currentLevel > lastLevel + 1) {
        warnings.push(
          `Título "${block.content}" (nível ${currentLevel}) pula do nível ${lastLevel}. ` +
          `Considere adicionar títulos intermediários.`
        );
      }
      
      lastLevel = currentLevel;
    });
  
  return warnings;
}