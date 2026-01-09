import React, { Fragment } from "react";
import { flexRender } from "@tanstack/react-table";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import '../../css/table.css';
import { Sort } from './Sort';

export function TableFooter(props){
  const { tableInstance, onRowClick } = props;

  return (
    <table className='table_back'>
      <thead>
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              let sorted = header?.column.getIsSorted();
              let style = header?.column.columnDef.meta?.style;
              return (
                <th key={header.id} className='table_header_text' style={style}>
                  <div className='table_header_cell' onClick={header.column.getToggleSortingHandler()}>
                    <div style={{flex: 1}}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                    {header.column.getCanSort() && <Sort sorted={sorted} />}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody className='table_body_back'>
        {tableInstance.getRowModel().rows.map(row => (
          <tr key={row.id} className='table_row'>
            {row.getVisibleCells().map(cell => {
              let noClick = cell.getContext().cell.column.columnDef.meta?.noClick;
              let style = cell.getContext().cell?.column.columnDef.meta?.style;
              return (
                <td className='table_cell_text1' key={cell.id} onClick={() => !noClick && onRowClick && onRowClick(row)} style={style}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      <tfoot style={{ position: "sticky", bottom: 0, alignSelf: "flex-end", zIndex: 0}}>
        {tableInstance.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id} className='table_footer_text_o'>
                {flexRender(header.column.columnDef.footer, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}

export function TableDetail(props){
  const { tableInstance, onRowClick, renderSubComponent } = props;

  return (
    <table className='table_back'>
      <thead>
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              let sorted = header?.column.getIsSorted();
              let style = header?.column.columnDef.meta?.style;
              return (
                <th key={header.id} className='table_header_text' style={style}>
                  <div className='table_header_cell' onClick={header.column.getToggleSortingHandler()}>
                    <div style={{flex: 1}}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                    {header.column.getCanSort() && <Sort sorted={sorted} />}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody className='table_body_back'>
        {tableInstance.getRowModel().rows.map(row => (
          <Fragment key={row.id}>
            <tr className='table_row'>
              {row.getVisibleCells().map(cell => {
                let noClick = cell.getContext().cell.column.columnDef.meta?.noClick;
                let style = cell.getContext().cell?.column.columnDef.meta?.style;
                return (
                  <td className='table_cell_text1' key={cell.id} onClick={() => !noClick && onRowClick && onRowClick(row)} style={style}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
            {row.getIsExpanded() && (
              <tr>
                <td colSpan={row.getVisibleCells().length} style={{paddingRight: 0}}>
                  {renderSubComponent({ row })}
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

export function TableRow(props){
  const { tableInstance, onRowClick, noHeader, scrolling, hasFooter } = props;

  return (
    <table className='table_back'>
      {!noHeader && <thead>
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              let sorted = header?.column.getIsSorted();
              let style = header?.column.columnDef.meta?.style;
              return (
                <th key={header.id} className={scrolling ? 'table_header_text1' : 'table_header_text'} style={style}>
                  <div className='table_header_cell' onClick={header.column.getToggleSortingHandler()}>
                    <div style={{flex: 1}}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                    {header.column.getCanSort() && <Sort sorted={sorted} />}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>}
      <tbody className='table_body_back'>
        {tableInstance.getRowModel().rows.map(row => (
          <tr key={row.id} className='table_row'>
            {row.getVisibleCells().map(cell => {
              let noClick = cell.getContext().cell.column.columnDef.meta?.noClick;
              let style = cell.getContext().cell?.column.columnDef.meta?.style;
              return (
                <td className='table_cell_text1' key={cell.id} onClick={() => !noClick && onRowClick && onRowClick(row)} style={style}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      {hasFooter && <tfoot style={{ position: "sticky", bottom: 0, alignSelf: "flex-end", zIndex: 0}}>
        {tableInstance.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id} className='table_footer_text_o'>
                {flexRender(header.column.columnDef.footer, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>}
    </table>
  );
}

export function Table(props){
  const { tableInstance, onRowClick, noHeader } = props;

  return (
    <table className='table_back'>
      {!noHeader && <thead>
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              let sorted = header?.column.getIsSorted();
              let style = header?.column.columnDef.meta?.style;
              return (
                <th key={header.id} className='table_header_text' style={style}>
                  <div className='table_header_cell' onClick={header.column.getToggleSortingHandler()}>
                    <div style={{flex: 1}}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                    {header.column.getCanSort() && <Sort sorted={sorted} />}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>}
      <tbody className='table_body_back'>
        {tableInstance.getRowModel().rows.map(row => {
          let style = row?.original?.row_color ? {backgroundColor: row?.original?.row_color, borderColor: '#fff'} : {};
          return (
            <tr key={row.id} className='table_row' style={style}>
              {row.getVisibleCells().map(cell => {
                let noClick = cell.getContext().cell.column.columnDef.meta?.noClick;
                let style = cell.getContext().cell?.column.columnDef.meta?.style;
                return (
                  <td className='table_cell_text1' key={cell.id} onClick={() => !noClick && onRowClick && onRowClick(row)} style={style}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

export function TableRowResize(props){
  const { tableInstance, onRowClick, hasFooter, TBodyComponent } = props;
  
  return (
    <table className='table_back_resize' style={{ width: tableInstance.getCenterTotalSize(), tableLayout: 'fixed' }}>
      <thead style={{ position: "sticky", top: 0, alignSelf: "flex-start", zIndex: 1}}>
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              let sorted = header?.column.getIsSorted();
              let style1 = header?.column.columnDef.meta?.style ?? {};
              let style = {...style1, position: 'relative', width: header.getSize() };
              return (
                <th key={header.id} className='table_header_text_resize' id={header?.column?.getIsResizing() ? 'resizing_th' : ''} style={style}>
                  <div className='table_header_cell' onClick={header.column.getToggleSortingHandler()}>
                    <div style={{flex: 1}} className='table_header_cell_resize'>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                    {header.column.getCanSort() && <Sort sorted={sorted} />}
                  </div>
                  <div
                    className='resizer' id={header?.column?.getIsResizing() ? 'resizing' : ''}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()} />
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      {TBodyComponent
        ? TBodyComponent(tableInstance)
        :<tbody className='table_body_back' style={{ position: "relative", zIndex: 0 }}>
        {tableInstance.getRowModel().rows.map(row => (
          <tr key={row.id} className='table_row_resize'>
            {row.getVisibleCells().map(cell => {
              let noClick = cell.getContext().cell.column.columnDef.meta?.noClick;
              let style1 = cell.getContext().cell?.column.columnDef.meta?.style ?? {};
              let style = {...style1, width: cell.column.getSize() };
              return (
                <td className='table_cell_text_resize' key={cell.id} onClick={() => !noClick && onRowClick && onRowClick(row)} style={style}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>}
      {hasFooter && <tfoot style={{ position: "sticky", bottom: 0, alignSelf: "flex-end", zIndex: 0}}>
        {tableInstance.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id} className='table_footer_text_o'>
                {flexRender(header.column.columnDef.footer, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>}
    </table>
  );
}

export function DraggableTable({
    tableInstance,
    onRowClick,
    renderSubComponent,
    setData,
    updateOrder
  }) {
    const rows = tableInstance.getRowModel().rows;

  const onDragEnd = result => {
    if (!result.destination) return;

    const from = result.source.index;
    const to = result.destination.index;

    const items = [...rows.map(r => r.original)];
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);

    setData(items);
    updateOrder?.(moved, from, to);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="table-body" direction="vertical">
        {(provided) => (
          <tbody
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="table_body_back"
          >
            {rows.map((row, index) => (
              <Fragment key={row.id}>
                <Draggable
                  draggableId={`row-${row.id}`}
                  index={index}
                >
                  {(provided) => (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="table_row"
                    >
                      {row.getVisibleCells().map(cell => {
                        const meta = cell.column.columnDef.meta || {};
                        return (
                          <td
                            key={cell.id}
                            className="table_cell_text1"
                            style={meta.style}
                            onClick={() =>
                              !meta.noClick && onRowClick?.(row)
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </Draggable>

                {row.getIsExpanded() && (
                  <tr>
                    <td
                      colSpan={row.getVisibleCells().length}
                      style={{ paddingRight: 0 }}
                    >
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    </DragDropContext>
  );
}
