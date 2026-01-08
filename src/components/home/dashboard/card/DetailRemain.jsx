import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from 'react-i18next';

import { Empty1, ModalTitle, Money, TableRowResize } from '../../../all';

export function DetailRemain(props){
  const { visible, setVisible, data1 } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setData(data1);
    setColumns([
      columnHelper.accessor('siteName', { header: t('bill.site'), size: 100, minSize: 75, maxSize: 100 }),
      columnHelper.accessor('invtName', { header: t('bill.invt') }),
      columnHelper.accessor('barCode', { header: t('inventory.barcode')}),
      columnHelper.accessor('categoryName', {header: t('category.title')}),
      columnHelper.accessor('orderQty', {
        header: <div style={{textAlign: 'right'}}>{t('bill.t_qty')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}>{props?.getValue()}</div>,
      }),
      columnHelper.accessor('salesQty', {
        header: <div style={{textAlign: 'right'}}>{t('bill.sales')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}>{props?.getValue()}</div>,
      }),
      columnHelper.accessor('qty', {
        header: <div style={{textAlign: 'right'}}>{t('bill.t_stock')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}>{props?.getValue()}</div>,
      }),
      columnHelper.accessor('cost', {
        header: <div style={{textAlign: 'right'}}>{t('bill.t_cost_unit')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('totalCost', {
        header: <div style={{textAlign: 'right'}}>{t('bill.t_total')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('price', {
        header: <div style={{textAlign: 'right'}}>{t('bill.price1')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('totalPrice', {
        header: <div style={{textAlign: 'right'}}>{t('bill.t_total1')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('statusName', {header: t('bill.status'),
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
        <ModalTitle icon='TbReportAnalytics' title={t('home.remain')} className='detail_title' />
        {!data?.length ? <Empty1 icon='MdOutlineArticle' /> : 
          <div className='table_scroll' style={{ overflow: 'scroll', minWidth: 220, maxHeight: 'calc(90vh - 220px)' }}>
            <TableRowResize {...tableProps} />
          </div>
        }
      </div>
    </Modal>
  );
}