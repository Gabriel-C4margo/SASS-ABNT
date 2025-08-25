'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/types/document';
import { useDocumentStore } from '@/store/documentStore';
import TitleBlock from './blocks/TitleBlock';
import SubtitleBlock from './blocks/SubtitleBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CitationBlock from './blocks/CitationBlock';
import PageBreakBlock from './blocks/PageBreakBlock';
import FreeFormBlock from './blocks/FreeFormBlock';
import ReferencesBlock from './blocks/ReferencesBlock';

interface DraggableBlockProps {
  block: Block;
}

export default function DraggableBlock({ block }: DraggableBlockProps) {
  const { updateBlock, deleteBlock, duplicateBlock } = useDocumentStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const commonProps = {
    id: block.id,
    content: block.content,
    onUpdate: updateBlock,
    onDelete: deleteBlock,
    onDuplicate: duplicateBlock,
    dragHandleProps: {
      ...attributes,
      ...listeners,
    },
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'title':
        return <TitleBlock {...commonProps} />;
      case 'subtitle':
        return <SubtitleBlock {...commonProps} />;
      case 'paragraph':
        return <ParagraphBlock {...commonProps} />;
      case 'citation':
        return <CitationBlock {...commonProps} />;
      case 'page-break':
        return <PageBreakBlock id={block.id} onDelete={deleteBlock} dragHandleProps={commonProps.dragHandleProps} />;
      case 'free-form':
        return <FreeFormBlock {...commonProps} />;
      case 'references':
        return <ReferencesBlock {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderBlock()}
    </div>
  );
}