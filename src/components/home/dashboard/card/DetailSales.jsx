import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from 'react-i18next';

import { Empty1, ModalTitle, Money, TableRowResize } from '../../../all';

export function DetailSales(props){
  const { visible, setVisible, data1 } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setData(data1);
    setColumns([
      columnHelper.accessor('salesDate', { header: t('home.time'), size: 100, minSize: 75, maxSize: 100 }),
      columnHelper.accessor('siteName', { header: t('bill.site') }),
      columnHelper.accessor('totalSalesAmt', {
        header: <div style={{textAlign: 'right'}}>{t('home.sales')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('salesQty', {
        header: <div style={{textAlign: 'right'}}>{t('home.sales_qty')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}>{props?.getValue()}</div>,
      }),
      columnHelper.accessor('totalReturnAmt', {
        header: <div style={{textAlign: 'right'}}>{t('bill.refund')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('returnQty', {
        header: <div style={{textAlign: 'right'}}>{t('home.return_qty')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}>{props?.getValue()}</div>,
      }),
      columnHelper.accessor('totalDiscAmt', {
        header: <div style={{textAlign: 'right'}}>{t('bill.discount')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('totalNetSalesAmt', {
        header: <div style={{textAlign: 'right'}}>{t('bill.pure1')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('totalCashAmount', {
        header: <div style={{textAlign: 'right'}}>{t('bill.cash')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('totalNonCashAmount', {
        header: <div style={{textAlign: 'right'}}>{t('bill.noncash')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('costOfGoods', {
        header: <div style={{textAlign: 'right'}}>{t('home.cost')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('totalProfitAmt', {
        header: <div style={{textAlign: 'right'}}>{t('home.profit')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
    ]);
    return () => {};
  }, [i18n?.language]);

  const onCancel = () => setVisible(false);

  const tableInstance = useReactTable({
    data, columns,
    columnResizeMode: 'onChange',
    defaultColumn: { size: 135, minSize: 90 },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: [{ id: 'salesDate', desc: true }] },
  });
  const tableProps = { tableInstance };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel={onCancel} centered={true} width={800}>
      <div className='m_back2'>
        <ModalTitle icon='TbReportAnalytics' title={t('home.sales')} className='detail_title' />
        {!data?.length ? <Empty1 icon='MdOutlineArticle' /> : 
          <div className='table_scroll' style={{ overflow: 'scroll', minWidth: 220, maxHeight: 'calc(90vh - 220px)' }}>
            <TableRowResize {...tableProps} />
          </div>
        }
      </div>
    </Modal>
  );
}