'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDocumentStore } from '@/store/documentStore';
import DraggableBlock from './DraggableBlock';

export default function DraggableBlockList() {
  const { document, reorderBlocks } = useDocumentStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedBlocks = [...document.blocks].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedBlocks.findIndex((block) => block.id === active.id);
      const newIndex = sortedBlocks.findIndex((block) => block.id === over?.id);

      const reorderedBlocks = arrayMove(sortedBlocks, oldIndex, newIndex);
      reorderBlocks(reorderedBlocks);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedBlocks.map((block) => block.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {sortedBlocks.map((block) => (
            <DraggableBlock key={block.id} block={block} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}