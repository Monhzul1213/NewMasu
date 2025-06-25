import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from 'react-i18next';

import { Empty1, ModalTitle, Money, TableRow } from "../../../all";

export function DetailAr(props){
  const { visible, setVisible, data1 } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setData(data1);
    setColumns([
      columnHelper.accessor('custName', { header: t('customer.title') }),
      columnHelper.accessor('beginArAmount', {
        header: <div style={{textAlign: 'right'}}>{t('home.beg_qty')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('addAmount', {
        header: <div style={{textAlign: 'right'}}>{t('home.created')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('closeAmount', {
        header: <div style={{textAlign: 'right'}}>{t('home.closed')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('endArAmount', {
        header: <div style={{textAlign: 'right'}}>{t('home.end')}</div>,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
    ]);
    return () => {};
  }, [i18n?.language]); 
  
  const onCancel = () => setVisible(false);

  const tableInstance = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const tableProps = { tableInstance };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel={onCancel} centered={true} width={800}>
      <div className='m_back2'>
        <ModalTitle icon='TbReportAnalytics' title={t('home.left')} className='detail_title' />
        {!data?.length ? <Empty1 icon='MdOutlineArticle' /> : 
          <div className='table_scroll' style={{overflowX: 'scroll'}} >
            <div className='table_scroll' style={{ overflowY: 'scroll', minWidth: 720, maxHeight: 'calc(90vh - 220px)' }}>
              <TableRow {...tableProps} />
            </div>
          </div>
        }
      </div>
    </Modal>
  );
}