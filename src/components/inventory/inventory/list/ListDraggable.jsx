import React from "react";
import { flexRender } from "@tanstack/react-table";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export function ListDraggable({ tableInstance, setData, updateOrder }) {
  const rows = tableInstance.getRowModel().rows;

  if (!rows.length) return null;

const onDragEnd = result => {
  if (!result.destination) return;

  setData(prev => {
    const items = [...prev];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    updateOrder?.(moved, result.source.index, result.destination.index);
    return items;
  });
};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="inventory-table" isDropDisabled={false}>
        {(provided) => (
          <tbody
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="table_body_back"
          >
            {rows.map((row, index) => {
              const id = row.original?.msInventory?.invtId;
              if (!id) return null;

              return (
                <Draggable key={id} draggableId={String(id)} index={index}>
                  {(provided) => (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="table_row_resize"
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="table_cell_text_resize1"
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    </DragDropContext>
  );
}
