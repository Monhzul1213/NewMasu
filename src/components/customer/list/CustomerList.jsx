import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Check, Empty1, Money, TableFooter } from "../../all";
import { CustomerTransaction } from "./CustomerTransaction";

export function CustomerList(props){
  const { pgWidth, data, columns, setColumns, setShow, onClickAdd, rowSelection, setRowSelection } = props;
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
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
        enableSorting: false,
        meta: { noClick: true }
      }),
      columnHelper.accessor('typeName', {
        header: t('customer.t_type'), exLabel: t('customer.t_type'),
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          return <div style={{textAlign: 'left', minWidth: 84}}>{t('customer.total') + rows?.length}</div>
        } 
      }),
      columnHelper.accessor('custName', { header: t('customer.t_name'), exLabel: t('customer.t_name') }),
      columnHelper.accessor('phone', { header: t('customer.t_phone'), exLabel: t('customer.t_phone') }),
      columnHelper.accessor('arBalance', {
        header: <div style={{textAlign: 'right'}}>{t('customer.receivable')}</div>,
        exLabel: t('customer.receivable'),
        cell: cell => (
          <div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => onClickLink(cell, setVisible)}><Money value={cell.getValue()} fontSize={12} /></div>
        ),
        meta: { onClickLink, noClick: true, setVisible, style: { width: 110 } },
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = useMemo(() => rows?.reduce((sum, row) => row.getValue('arBalance') + sum, 0), [rows]);
          return <div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} fontSize={12} /></div>
        }
      }),
      columnHelper.accessor('email', { header: t('customer.mail'), exLabel: t('customer.mail') }),
      columnHelper.accessor('branchName', { header: <span style={{minWidth: 120}}>{t('customer.city')}</span>, exLabel: t('customer.city') }),
      columnHelper.accessor('subBranchName', { header: <span style={{minWidth: 100}}>{t('customer.district')}</span>, exLabel: t('customer.district') }),
      columnHelper.accessor('address', { header: t('customer.address'), exLabel: t('customer.address') }),
      columnHelper.accessor('custCode', {
        header: <div style={{textAlign: 'right'}}>{t('customer.code')}</div>,
        exLabel: t('customer.code'),
        cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.getValue()}</div>,
      }),
      columnHelper.accessor('note', { header: t('customer.desc'), exLabel: t('customer.desc') }),
    ]);
    return () => {};
  }, [i18n?.language]);

  useEffect(() => {
    setShow(Object.values(rowSelection)?.length ? true : false);
    return () => {};
  }, [rowSelection]);

  const onClickLink = (cell, setVisible) => {
    setVisible(true);
    setSelected(cell?.row?.original);
  }

  const tableInstance = useReactTable({
    data, columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: row => row.custId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });
  const tableProps = { tableInstance, onRowClick: onClickAdd };
  const transProps = { visible, setVisible, selected };

  return (
    <div>
      {visible && <CustomerTransaction {...transProps} />}
      {!data?.length ? <Empty1 icon='MdSupervisorAccount' /> : 
        <div style={{overflow: 'scroll'}} >
          <div className='table_scroll' id='paging' style={{ marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 520 }}>
            <TableFooter {...tableProps} />
          </div>
        </div>
      }
    </div>
  );
}