import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem.jsx";

export default function ClipList({ clips, setClips, onRemove }) {
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = clips.findIndex((c) => c.id === active.id);
    const newIndex = clips.findIndex((c) => c.id === over.id);
    setClips(arrayMove(clips, oldIndex, newIndex));
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={clips.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {clips.map((clip) => (
            <SortableItem
              key={clip.id}
              clip={clip}
              onRemove={() => onRemove(clip.id)}
            />
          ))}
          {!clips.length && <div className="small">Chưa có clip nào.</div>}
        </div>
      </SortableContext>
    </DndContext>
  );
}
