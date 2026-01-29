import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Check, CheckAll, Table } from "../../all";

export function ModifierCardSite(props){
  const { checked, setChecked, setEdited, data, setData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    let columns = [
      columnHelper.accessor('checked', {
        id: 'select-col',
        header: <div className="cell_center" style={{maxWidth: 60}}>{t('inventory.t_choose')}</div>,
        cell: ({ row, table }) => (
          <div className="cell_center">
            <Check checked={row?.original?.checked} onClick={e => table?.options?.meta?.onClickCheck(e, row)} />
          </div>
        ),
        enableSorting: false,
        meta: { style: { width: 50 } }
      }),
      columnHelper.accessor('name', { header: <div style={{flex: 1}}>{t('inventory.t_site')}</div> }),
    ];
    setColumns(columns);
    return () => {};
  }, [i18n?.language]);

  const onCheckAll = checked => {
    setChecked(checked);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked };
    }));
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if(index === item?.index) return { ...old[item?.index], checked: !row?.checked };
      return row;
    }));
  }

  const tableInstance = useReactTable({
    data, columns,
    state: { sorting },
    // initialState: { pagination: { pageIndex: 0, pageSize: 3 } },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { onClickCheck }
  });
  const tableProps = { tableInstance };
  
  return (
    <div className='ia_back' style={{maxWidth: 'var(--empty-width)'}}>
      <p className='ac_title'>{t('inventory.sites')}</p>
      <div style={{padding: 5}} />
      <CheckAll type='inventory' checked={checked} onCheckAll={onCheckAll} style={{ border: 'none' }} />
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' className="i_scroll_table">
          <Table {...tableProps} />
        </div>
      </div>
    </div>
  );
}