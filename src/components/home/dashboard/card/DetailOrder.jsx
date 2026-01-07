import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from 'react-i18next';

import { Empty1, ModalTitle, Money, TableRowResize } from '../../../all';
import moment from "moment";

export function DetailOrder(props){
  const { visible, setVisible, data1 } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
  setData(data1);
  setColumns([
    columnHelper.accessor('salesDate', {header: t('page.date'), size: 100, minSize: 90,
      cell: info => (<div>{moment(info.getValue())?.format('YYYY.MM.DD')}</div>),
      footer: () => `${t('report.total')} ${data?.length ?? 0}`,
    }),
    columnHelper.accessor('siteName', {header: t('bill.site'), size: 130, minSize: 90}),
    columnHelper.accessor('terminalName', { header: t('report.pos'), size: 80, minSize: 70}),
    columnHelper.accessor('ticket', {header: t('customer.location'), size: 130, minSize: 80}),
    columnHelper.accessor('cashierName', {header: t('report.empName'), size: 100, minSize: 80}),
    columnHelper.accessor('salesTypeName', {header: t('customer.t_type'), size: 100, minSize: 80}),
    columnHelper.accessor('customer', { header: t('menu.customer'), size: 110, minSize: 80}),
    columnHelper.accessor('totalAmount', {
      header: <div style={{ textAlign: 'right' }}>{t('report.amount')}</div>, size: 100, minSize: 90,
      cell: info => (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={info.getValue()} /></div>),
      footer: info => {
        const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.original.totalAmount ?? 0), 0);
        return (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={total} /></div>);
      },
    }),
    columnHelper.accessor('totalDiscountAmount', {
      header: <div style={{ textAlign: 'right' }}>{t('report.discount')}</div>, size: 100, minSize: 90,
      cell: info => ( <div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={info.getValue()} /></div>),
      footer: info => {
        const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.original.totalDiscountAmount ?? 0), 0);
        return (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={total} /></div>);
      },
    }),
    columnHelper.accessor('totalSalesAmount', {
      header: <div style={{ textAlign: 'right' }}>{t('report.salesAmount')}</div>, size: 100, minSize: 90,
      cell: info => (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={info.getValue()} /></div>),
      footer: info => {
        const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.original.totalSalesAmount ?? 0), 0);
        return (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={total} /></div>);
      },
    }),
    columnHelper.accessor('totalCashAmount', {
      header: <div style={{ textAlign: 'right' }}>{t('report.cash')}</div>, size: 100, minSize: 90,
      cell: info => (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={info.getValue()} /></div>),
      footer: info => {
        const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.original.totalCashAmount ?? 0), 0);
        return (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={total} /></div>);
      },
    }),
    columnHelper.accessor('totalNonCashAmount', {
      header: <div style={{ textAlign: 'right' }}>{t('report.non_cash')}</div>, size: 100, minSize: 90,
      cell: info => (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={info.getValue()} /></div>),
      footer: info => {
        const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.original.totalNonCashAmount ?? 0), 0);
        return (<div style={{ textAlign: 'right', paddingRight: 15 }}><Money value={total} /></div>);
      },
    }),
    columnHelper.accessor('descr', {header: t('customer.descr'), size: 90, minSize: 90}),
  ]);
}, [i18n?.language, data?.length]);


  const onCancel = () => setVisible(false);

  const tableInstance = useReactTable({
    data, columns,
    columnResizeMode: 'onChange',
    defaultColumn: { size: 135, minSize: 90 },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: [{ id: 'salesDate', desc: true }] },
  });
  const tableProps = { tableInstance, hasFooter: true };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel={onCancel} centered={true} width={800}>
      <div className='m_back2'>
        <ModalTitle icon='TbReportAnalytics' title={t('home.sales_order')} className='detail_title' />
        {!data?.length ? <Empty1 icon='MdOutlineArticle' /> : 
          <div className='table_scroll' style={{ overflow: 'scroll', minWidth: 220, maxHeight: 'calc(90vh - 220px)' }}>
            <TableRowResize {...tableProps} />
          </div>
        }
      </div>
    </Modal>
  );
}