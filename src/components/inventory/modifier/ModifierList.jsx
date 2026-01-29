import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Check, Empty1, Table } from "../../all";

export function ModifierList(props){
  const { pgWidth, data, columns, setColumns, setShow, rowSelection, setRowSelection, onClickAdd} = props;
  const { t, i18n } = useTranslation();
  const [maxHeight, setMaxHeight] = useState(120);
  const columnHelper = createColumnHelper();
  
  useEffect(() => {
    let height1 = 'calc(100vh - var(--header1-height) - var(--page-padding) * 2', height2 = '';
    if(pgWidth >= 1090) height2 = ' - var(--filter-height)';
    if(pgWidth < 1090 && pgWidth >= 766) height2 = ' - var(--filter-height) * 2 - 10px';
    if(pgWidth < 766 && pgWidth >= 422) height2 = ' - var(--filter-height) * 3 - 20px';
    if(pgWidth < 422) height2 = ' - var(--filter-height) * 4 - 30px';
    setMaxHeight(height1 + height2 + ' - 10px)');
    return () => {};
  }, [pgWidth]);

  useEffect(() => {
    setColumns([
      columnHelper.accessor('checked', {
        id: 'select-col',
        header: ({ table }) => <div className="cell_center"><Check checked={table.getIsAllRowsSelected()} onClick={table.getToggleAllRowsSelectedHandler()} /></div>,
        cell: ({ row }) => <div className="cell_center"><Check checked={row.getIsSelected()} onClick={row.getToggleSelectedHandler()} /></div>,
        enableSorting: false, width: 50,
        meta: { noClick: true, size: 40},
      }),
      columnHelper.accessor('modifer.modiferName', { header: t('page.name'), meta: { width: 160 } }), 
    ]);
    return () => {};
  }, [i18n?.language]);

  useEffect(() => {
    setShow(Object.values(rowSelection)?.length ? true : false);
    return () => {};
  }, [rowSelection]);

  const tableInstance = useReactTable({
    data, columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: row => row?.modifer.modifireID,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const tableProps = { tableInstance, onRowClick: onClickAdd};
  
  return (
    <div >
      {!data?.length ? <Empty1 icon='MdSupervisorAccount' /> : 
          <div className='table_scroll' id='paging' style={{ marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 320 }}>
            <Table {...tableProps} />
        </div>
      }
    </div>
  );
}